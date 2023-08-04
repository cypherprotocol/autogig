import { autogigFunctions } from "@/app/api/gig/functions";
import { apifyClient } from "@/lib/apify";
import supabase from "@/lib/supabase";
import { convertToReadable, getPortfolio, getRepos } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import * as z from "zod";

// export const runtime = "edge";

const gigSchema = z.object({
  github: z.string().optional(),
  resume: z.string().optional(),
  portfolio: z.string().optional(),
});

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { github, resume, portfolio } = gigSchema.parse(json);

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Collect all data relevant to user looking for a job
  const profileInput = JSON.stringify({
    resume: resume && resume?.replace(/\n/g, " "),
    portfolio: await getPortfolio(portfolio),
    github: convertToReadable(await getRepos(github)),
  });

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

  const applicantInfoResponse = await openai.createChatCompletion({
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
    applicantInfoResponse.data.choices[0].message?.function_call?.arguments ??
      "{}"
  );

  if (chunks) {
    const promises = chunks.map(async (chunk) => {
      const coverLetterResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that efficiently finds details about a job candidate and generates a cover letter for them. You are given a candidate's profile and a job description. You must generate a persuasive and professional introduction message. The message should express the candidate's enthusiasm for the potential job role, align their experience with the job requirements, and initiate further discussions or negotiations.",
          },
          {
            role: "user",
            content: `Given the candidates profile: '${profileInput}', and the potential job description: '${JSON.stringify(
              chunk
            )}', please generate a persuasive and professional introduction message. The message should express the candidate's enthusiasm for the potential job role, align their experience with the job requirements, and initiate further discussions or negotiations.`,
          },
        ] as ChatCompletionRequestMessage[],
      });

      const coverLetter = coverLetterResponse.data.choices[0].message?.content;

      const input = {
        url: chunk.data.job_link,
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

      apifyClient.actor("guiltless_peach/autogig").call(input);
    });

    await Promise.all(promises);
  }

  return new Response(
    JSON.stringify({
      jobs: chunks,
    })
  );
}
