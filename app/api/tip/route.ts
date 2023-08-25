import { parsePDF } from "@/lib/parse-pdf";
import { formSchema } from "@/lib/types";
import { getRepos } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import * as z from "zod";

const gigSchema = z.object({
  githubForm: formSchema.optional(),
  resume: z.custom<File>((file) => file instanceof File).optional(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const { resume, githubForm } = gigSchema.parse(formData);

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  let resumeText = "";

  if (resume) {
    resumeText = await parsePDF(resume);
  }

  // Collect all data relevant to user looking for a job
  const profileInput = JSON.stringify({
    resume: resumeText,
    // portfolio: await getPortfolio(portfolio),
    github: await getRepos(githubForm?.username),
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
