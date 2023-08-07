import { Json } from "@/lib/types/supabase";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import * as z from "zod";

export const runtime = "edge";

const gigSchema = z.object({
  github: z.string().optional(),
  resume: z.string().optional(),
  portfolio: z.string().optional(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Repositories {
  name: string | null;
  language_data: Json | null;
  description: string | null;
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { resume } = gigSchema.parse(json);

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Collect all data relevant to user looking for a job
  const profileInput = JSON.stringify({
    resume: resume,
    // portfolio: await getPortfolio(portfolio),
    // github: convertToReadable(await getRepos(github)),
  });

  const tipResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: `You are a experienced recruiter that is reviewing a job candidates. Give them a single sentence suggesting a project they could undertake to strengthen their profile or a tip to help them improve their experience to land more jobs.`,
      },
      {
        role: "user",
        content: `Given my profile: ${profileInput}, please give me single sentence tip to help them improve my experience to land more jobs.`,
      },
    ],
  });

  const tip = tipResponse.choices[0].message?.content;

  return new Response(
    JSON.stringify({
      tip,
    })
  );
}
