import supabase from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";
import * as z from "zod";

const gigSchema = z.object({
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const values = gigSchema.parse(Object.fromEntries(url.searchParams));

  const session = await getServerSession();
  console.log(session);
  const token = await getToken({ req, secret: process.env.SECRET });

  // Make sure user is authenticated
  if (session) {
    // If user already exists, get their repositories from database
    const { data: github } = await supabase
      .from("github")
      .select("*")
      .eq("name", values.github);

    if (github && github.length > 0) {
      const { data: repositories } = await supabase
        .from("repository")
        .select("*")
        .eq("user_id", github[0].id);

      console.log(repositories);
      console.log("token", token);
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

    // STEP 3: Parse information and generate embeddings

    return NextResponse.json({ message: "Hello World" });
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
}
