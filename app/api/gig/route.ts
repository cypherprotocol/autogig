import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";
import { TwitterApi } from "twitter-api-v2";
import * as z from "zod";

const gigSchema = z.object({
  twitter: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const values = gigSchema.parse(Object.fromEntries(url.searchParams));

  const session = await getServerSession();
  const token = await getToken({ req, secret: process.env.SECRET });

  console.log(token);

  if (session) {
    // STEP 1: Fetch twitter handle from authenticated user
    const client = new TwitterApi(token?.accessToken as string);

    const user = await client.v2.me();

    // STEP 2: Get revelant information on user based on twitter handle
    const octokit = new Octokit();

    const repo = await octokit.rest.repos.get({
      owner: user.data.username,
      repo: "frame",
    });

    console.log(repo);

    // STEP 3: Parse information and generate embeddings

    return NextResponse.json({ message: "Hello World" });
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
}
