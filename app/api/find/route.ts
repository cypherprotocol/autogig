import { autogigFunctions } from "@/app/api/find/functions";
import { coverLetterSystem } from "@/app/api/find/prompts";
import supabase from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import * as z from "zod";

export const runtime = "edge";
export const fetchCache = "auto";

const gigSchema = z.object({
  github: z.string().optional(),
  resume: z.string().optional(),
  portfolio: z.string().optional(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { resume } = gigSchema.parse(json);

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  let user = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  if (!user) {
    user = await supabase
      .from("users")
      .insert([{ clerk_id: clerkUser.id }])
      .single();
  }

  // Collect all data relevant to user looking for a job
  const profileInput = JSON.stringify({
    resume: resume,
    // portfolio: await getPortfolio(portfolio),
    // github: convertToReadable(await getRepos(github)),
  });

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
  });

  const profileEmbedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: profileInput,
  });

  const embedding = profileEmbedding.data[0].embedding;

  const chunks = await vectorStore.similaritySearchVectorWithScore(
    embedding,
    3,
    {
      type: "jobs",
    }
  );

  if (user.data?.num_runs && user.data.num_runs >= 1) {
    return new Response(
      JSON.stringify({
        numRuns: user.data.num_runs,
        jobs: chunks.map((chunk) => JSON.parse(chunk[0].pageContent)),
      })
    );
  }

  const applicantInfoResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    functions: autogigFunctions,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: profileInput,
      },
    ],
    function_call: {
      name: "get_applicant_info",
    },
  });

  const applicantInfo = JSON.parse(
    applicantInfoResponse.choices[0].message?.function_call?.arguments ?? "{}"
  );

  if (chunks) {
    const promises = chunks.map(async (chunk) => {
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
            Given my profile: '${profileInput}', and the potential job description: '${JSON.stringify(
              chunk[0].pageContent
            )}',
            please generate me a persuasive and professional introduction message.
            The message should express my enthusiasm for the potential job role,
            align my experience with the job requirements, and initiate further discussions or negotiations.
  `,
          },
        ],
      });

      const coverLetter = coverLetterResponse.choices[0].message?.content;

      console.log(chunk);

      const input = {
        url: JSON.parse(chunk[0].pageContent).job_link,
        name: applicantInfo?.name,
        email: applicantInfo?.email,
        phone: applicantInfo?.phone,
        address: applicantInfo?.address,
        organization: applicantInfo?.organization,
        linkedin: applicantInfo?.linkedin,
        github: applicantInfo?.github,
        portfolio: applicantInfo?.portfolio,
        coverLetter: coverLetter,
        resume: resume,
        location: applicantInfo?.location,
        school: applicantInfo?.school,
        startDate: applicantInfo?.startDate,
      };

      fetch(
        `https://api.apify.com/v2/acts/guiltless_peach~autogig/runs?token=${process.env.APIFY_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );
    });

    await Promise.all(promises);
  }

  await supabase.from("users").update({ num_runs: 1 }).eq("id", user.data?.id);

  return new Response(
    JSON.stringify({
      numRuns: user.data?.num_runs,
      jobs: chunks.map((chunk) => JSON.parse(chunk[0].pageContent)),
    })
  );
}
