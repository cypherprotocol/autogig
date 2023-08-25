import { coverLetterSystem } from "@/app/api/find/prompts";
import { parsePDF } from "@/lib/parse-pdf";
import supabase from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();

  if (!clerkUser || clerkUser.publicMetadata.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileName, job } = await req.json();
  console.log(fileName, typeof job);

  const { data: resume, error } = await supabase.storage
    .from("autogig")
    .download(`resumes/${fileName}`);
  console.log(resume);
  let resumeText = "";

  if (resume) {
    resumeText = await parsePDF(resume as File);
    console.log(resumeText);
  }

  const coverLetterResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: coverLetterSystem,
      },
      {
        role: "user",
        content: `
            Given my profile: '${JSON.stringify(
              resumeText
            )}', and the potential job description: '${JSON.stringify(job)}',
            please generate me a persuasive and professional introduction message.
            The message should express my enthusiasm for the potential job role,
            align my experience with the job requirements, and initiate further discussions or negotiations.
  `,
      },
    ],
  });

  const coverLetter = coverLetterResponse.choices[0].message?.content;

  return new Response(
    JSON.stringify({
      coverLetter: coverLetter,
    })
  );
}
