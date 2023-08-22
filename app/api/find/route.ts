import { autogigFunctions } from "@/app/api/find/functions";
import { coverLetterSystem } from "@/app/api/find/prompts";
import { embedData } from "@/lib/embed";
import supabase from "@/lib/supabase";
import { formSchema } from "@/lib/types";
import { getRepos } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import * as z from "zod";

export const runtime = "edge";
export const fetchCache = "auto";

const gigSchema = z.object({
  githubForm: formSchema.optional(),
  resume: z.string().optional(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { resume, githubForm } = gigSchema.parse(json);

  const clerkUser = await currentUser();
  const id = nanoid();

  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
  });

  let user = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  if (!user.data) {
    const { error, data } = await supabase
      .from("users")
      .insert({ clerk_id: clerkUser.id })
      .single();
  }

  // Collect all data relevant to user looking for a job
  let profileInput: any;
  let applicantInfo: any;

  if (resume) {
    profileInput = {
      resume: resume,
    };

    // Split the resume into optimal chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
    });

    const output = await splitter.createDocuments([resume]);

    // Insert each chunk into the SupabaseVectorStore
    await SupabaseVectorStore.fromTexts(
      output.map((chunk) => chunk.pageContent),
      Array(output.length).fill({
        type: "resume",
        id: clerkUser.id,
        run_id: id,
      }),
      new OpenAIEmbeddings(),
      {
        client: supabase,
        tableName: "documents",
        queryName: "match_documents",
      }
    );

    const resumeEmbeddings = await vectorStore.similaritySearch(
      JSON.stringify(autogigFunctions),
      5,
      {
        type: "resume",
        id: clerkUser.id,
        run_id: id,
      }
    );

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
          content: JSON.stringify(resumeEmbeddings),
        },
      ],
      function_call: {
        name: "get_applicant_info",
      },
    });

    applicantInfo = JSON.parse(
      applicantInfoResponse.choices[0].message?.function_call?.arguments ?? "{}"
    );

    profileInput = {
      ...profileInput,
      github: await getRepos(applicantInfo?.github),
    };
  } else {
    // Github submission
    profileInput = {
      github: await getRepos(githubForm?.username),
    };
  }

  const profileEmbedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: JSON.stringify(profileInput),
  });

  const embedding = profileEmbedding.data[0].embedding;

  const chunks = await vectorStore.similaritySearchVectorWithScore(
    embedding,
    3,
    {
      type: "new_jobs_2",
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
            Given my profile: '${JSON.stringify(
              profileInput
            )}', and the potential job description: '${JSON.stringify(
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

      let input;

      if (resume) {
        input = {
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
      } else {
        // Github submission
        input = {
          url: JSON.parse(chunk[0].pageContent).job_link,
          name: githubForm?.name,
          email: githubForm?.email,
          phone: undefined,
          address: githubForm?.address,
          organization: undefined,
          linkedin: undefined,
          github: githubForm?.username,
          portfolio: undefined,
          coverLetter: coverLetter,
          resume: undefined,
          location: undefined,
          school: undefined,
          startDate: undefined,
        };
      }

      await embedData([JSON.stringify(input)], {
        id: clerkUser.id,
        type: "autogig_run",
      });

      // fetch(
      //   `https://api.apify.com/v2/acts/guiltless_peach~autogig/runs?token=${process.env.APIFY_TOKEN}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(input),
      //   }
      // );
    });

    await Promise.all(promises);
  }

  await supabase
    .from("users")
    .update({ num_runs: 1 })
    .eq("clerk_id", clerkUser.id);

  return new Response(
    JSON.stringify({
      numRuns: user.data?.num_runs,
      jobs: chunks.map((chunk) => JSON.parse(chunk[0].pageContent)),
      email: applicantInfo?.email,
      firstName: applicantInfo?.name?.split(" ")[0],
    })
  );
}
