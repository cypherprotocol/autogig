import supabase from "@/lib/supabase";
import { Json } from "@/lib/types/supabase";
import { currentUser } from "@clerk/nextjs";
import axios from "axios";
import { load } from "cheerio";
import { NextRequest } from "next/server";
import { Octokit } from "octokit";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
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

interface Repositories {
  name: string | null;
  language_data: Json | null;
  description: string | null;
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { twitter, github, resume, portfolio } = gigSchema.parse(json);

  let githubId = 0;
  let githubRepos: Repositories[] = [];

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Make sure user is authenticated
  if (github) {
    // If user already exists, get their repositories from database
    const { data: githubData } = await supabase
      .from("github")
      .select("*")
      .eq("name", github);

    console.log("github", github);

    if (githubData && githubData.length > 0) {
      githubId = githubData[0].id;

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
            name: github,
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
      const octokit = new Octokit();

      const userRepos = await octokit.rest.repos.listForUser({
        username: github,
      });

      const top3Repos = userRepos.data
        .filter((repo) => !!repo.stargazers_count) // Filter out repos without stars count
        .sort((a, b) => b.stargazers_count! - a.stargazers_count!) // Sort in descending order
        .slice(0, 3); // Take the top 3

      for (const repo of top3Repos) {
        try {
          const repoLanguages = await octokit.rest.repos.listLanguages({
            owner: github,
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

  if (portfolio) {
    const response = await axios.get(portfolio);
    const html = response.data;

    const $ = load(html);

    const text = $("body").text();

    console.log("text", text);

    portfolioText = text;
  }

  // Collect all data relevant to user looking for a job
  const profileInput =
    (resume && resume?.replace(/\n/g, " ")!) +
    " " +
    (portfolio && portfolioText) +
    " " +
    convertToReadable(githubRepos);

  const messages = [
    {
      role: "system",
      content: `
     As an AI, provide the applicant with a single, concise sentence of actionable advice to improve their profile based on their resume, portfolio, or GitHub repo. Also, give them a single sentence suggesting a project they could undertake to strengthen their profile. 

${profileInput}`,
    },
  ];

  const tipResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: messages as ChatCompletionRequestMessage[],
  });

  const tip = tipResponse.data.choices[0].message?.content;

  return new Response(
    JSON.stringify({
      tip,
    })
  );
}