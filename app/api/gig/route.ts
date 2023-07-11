import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { Octokit } from "octokit";
import { Configuration, OpenAIApi } from "openai";
import * as z from "zod";

const gigSchema = z.object({
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  resume: z.string().optional(),
});

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const json = await req.json();
  const values = gigSchema.parse(json);

  const session = await getServerSession();
  const token = await getToken({ req, secret: process.env.SECRET });

  let githubId = 0;
  let repos: any[] = [];

  // Make sure user is authenticated
  if (session) {
    // If user already exists, get their repositories from database
    const { data: github } = await supabase
      .from("github")
      .select("*")
      .eq("name", values.github);

    if (github && github.length > 0) {
      githubId = github[0].id;

      const { data: repositories } = await supabase
        .from("repository")
        .select("*")
        .eq("user_id", githubId);

      if (repositories && repositories.length > 0) {
        repos = repositories;
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

          if (error) {
            console.log("Error storing data in database:", error);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    // STEP 3: Parse information
    const synposisQuestion =
      "Can you concisely and accurately summarize this persons expertise based off of their resume.";
    const synopsisMessage = `${synposisQuestion}\n${values.resume}`;

    // Ask OpenAI for a streaming chat completion given the prompt
    const synposisResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: synopsisMessage,
        },
      ],
    });

    const { data: jobs } = await supabase.from("jobs").select("*");

    const getGigQuestion =
      "We have a potential candidate with expertise in several areas. They have worked on these repositories, showcasing their skills and contributions. I will also provide a list of potential job openings. Given all this information, could you please recommend the most suitable job for this candidate?";
    const getGigMessage = `${getGigQuestion}\n${repos.toString()}\n${
      synposisResponse.data.choices[0].message?.content
    }\n${JSON.stringify(jobs?.splice(0, 3))}`;

    console.log(getGigMessage);

    const messageResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Hello, you are an AI job matchmaker. Your task is to analyze the data provided about a person's professional experience and expertise, and then recommend a job that would be a good fit for them.",
        },
        {
          role: "user",
          content: getGigMessage,
        },
      ],
    });

    console.log(messageResponse.data.choices[0].message?.content);

    return new Response(
      JSON.stringify(messageResponse.data.choices[0].message?.content)
    );
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
}
