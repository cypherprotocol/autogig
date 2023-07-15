import supabase from "@/lib/supabase";
import { PotentialJob } from "@/lib/types";
import { Json } from "@/lib/types/supabase";
import axios from "axios";
import { load } from "cheerio";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { Octokit } from "octokit";
import { Configuration, OpenAIApi } from "openai";
import * as z from "zod";

// export const runtime = "edge";

const gigSchema = z.object({
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  resume: z.string().optional(),
  portfolio: z.string().optional(),
});

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const linkedinUsername = process.env.LINKEDIN_USERNAME as string;
const linkedinPassword = process.env.LINKEDIN_PASSWORD as string;

interface Repositories {
  name: string | null;
  language_data: Json | null;
  description: string | null;
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const values = gigSchema.parse(json);

  console.log("values", values);

  const session = await getServerSession();
  const token = await getToken({ req, secret: process.env.SECRET });

  let githubId = 0;
  let githubRepos: Repositories[] = [];

  // Make sure user is authenticated
  if (true) {
    if (values.github) {
      // If user already exists, get their repositories from database
      const { data: github } = await supabase
        .from("github")
        .select("*")
        .eq("name", values.github);

      console.log("github", github);

      if (github && github.length > 0) {
        githubId = github[0].id;

        const { data: repositories } = await supabase
          .from("repository")
          .select("name, language_data, description")
          .eq("user_id", githubId);

        if (repositories && repositories.length > 0) {
          githubRepos = repositories;
        }
      } else {
        // If user does not exist, create them and their repositories
        console.log("github does not exist");
        const githubUser = await supabase
          .from("github")
          .insert([
            {
              name: values.github!,
            },
          ])
          .select();

        if (githubUser.data) {
          githubId = githubUser.data[0].id;
        }

        // STEP 1: Setup twitter API for authenticated user
        // const client = new TwitterApi(token?.twitter?.accessToken as string);

        // const user = await client.v2.me();

        // STEP 2: Get revelant information on user based on github from resume
        const octokit = new Octokit({
          auth: token?.github?.accessToken as string,
        });

        const userRepos = await octokit.rest.repos.listForUser({
          username: values?.github ?? "",
        });

        const top3Repos = userRepos.data
          .filter((repo) => !!repo.stargazers_count) // Filter out repos without stars count
          .sort((a, b) => b.stargazers_count! - a.stargazers_count!) // Sort in descending order
          .slice(0, 3); // Take the top 3

        for (const repo of top3Repos) {
          try {
            const repoLanguages = await octokit.rest.repos.listLanguages({
              owner: values?.github ?? "",
              repo: repo.name,
            });

            const { error } = await supabase.from("repository").insert([
              {
                name: repo.name,
                description: repo.description,
                language_data: repoLanguages.data,
                user_id: githubUser?.data?.[0]?.id,
              },
            ]);

            githubRepos.push({
              name: repo.name,
              description: repo.description,
              language_data: repoLanguages.data,
            });

            if (error) {
              console.log("Error storing data in database:", error);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }

    // if (values.linkedin) {
    //   const client = new Client();
    //   await client.login.userPass({
    //     username: linkedinUsername,
    //     password: linkedinPassword,
    //   });

    //   client.search.searchPeople({});
    // }

    // STEP 3: Parse information

    const convertToReadable = (data: Repositories[]): string => {
      const text = data
        .map((repo) => {
          return `Repository: ${repo.name}, Description: ${
            repo.description
          }, Languages: ${
            repo.language_data ? Object.keys(repo.language_data).join(", ") : ""
          } `;
        })
        .join("\n");

      return text;
    };

    let portfolioText = "";

    if (values.portfolio) {
      const response = await axios.get(values.portfolio);
      const html = response.data;

      const $ = load(html);

      const text = $("body").text();

      console.log("text", text);

      portfolioText = text;
    }

    // Collect all data relevant to user looking for a job
    const profileInput =
      (values.resume && values.resume?.replace(/\n/g, " ")!) +
      " " +
      (values.portfolio && portfolioText) +
      " " +
      convertToReadable(githubRepos);

    const profileEmbedding = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: profileInput,
    });

    const [{ embedding }] = profileEmbedding.data.data;

    const { data: chunks, error } = await supabase.rpc("jobs_search", {
      query_embedding: embedding,
      similarity_threshold: 0.5,
      match_count: 3,
    });

    let jobs: PotentialJob[] = [];

    if (chunks) {
      for (const chunk of chunks) {
        const introResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that efficiently matches resumes with job listings, analyzing the expertise and specialty of each individual. By leveraging the provided resumes and job descriptions, you provide tailored recommendations for the best-fitting jobs. Your goal is to assist users in finding relevant opportunities that align with their skills and experience. Your expertise lies in efficiently comparing resumes to job listings and providing accurate and concise recommendations for the users' benefit.",
            },
            {
              role: "user",
              // content: `Please prepare an introduction for the candidate named ${candidate.name}, who has expertise in ${candidate.expertise}, experience in ${candidate.experience}, and a demonstrated interest in ${candidate.interests}. They are being considered for the role of ${jobRole}, which requires skills in ${jobSkills}.`,
              content: `Given the candidates resume: '${
                values.resume
              }', and the potential job description: '${JSON.stringify(
                chunk.data
              )}', please generate a persuasive and professional introduction message. The message should express the candidate's enthusiasm for the potential job role, align their experience with the job requirements, and initiate further discussions or negotiations.`,
            },
          ],
        });

        jobs.push({
          response: introResponse.data.choices[0].message?.content as string,
          companyName: (chunk?.data as any).company.name,
          companyLogo: (chunk?.data as any).company.logoUrl,
          jobLink: (chunk?.data as any).url,
          jobTitle: (chunk?.data as any).title,
        });
      }
    }

    return new Response(
      JSON.stringify({
        potentialJobs: jobs,
      })
    );
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
}
