import { autogigFunctions } from "@/app/api/find/functions";
import { parsePDF } from "@/lib/parse-pdf";
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const resume = formData.get("resume") as File;

  const id = nanoid();

  let githubForm: any;
  if (formData.get("githubForm") !== null) {
    const githubFormValue = formData.get("githubForm") as string;
    githubForm = JSON.parse(githubFormValue) as z.infer<typeof formSchema>;
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
    let newUser = await supabase
      .from("users")
      .insert({ clerk_id: clerkUser.id })
      .select();
  }

  // Collect all data relevant to user looking for a job
  let profileInput: any;
  let applicantInfo: any;
  let resumeText = "";

  if (resume) {
    resumeText = await parsePDF(resume);

    // Split the resume into optimal chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
    });

    const output = await splitter.createDocuments([resumeText]);

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

  await supabase
    .from("users")
    .update({ num_runs: 1 })
    .eq("clerk_id", clerkUser.id);

  const fileName = `${nanoid()}.pdf`;

  const res = await supabase.storage
    .from("autogig")
    .upload(`resumes/${fileName}`, resume as File);

  if (res.error) {
    console.log(res.error);
  }

  const profile = await supabase
    .from("profiles")
    .insert({
      user_id: clerkUser.id,
      file_name: fileName,
      email: applicantInfo?.email,
    })
    .select()
    .single();

  await supabase.from("tasks").insert({
    user: clerkUser.id,
    profile: profile.data?.id!,
    title: applicantInfo?.name,
  });

  return new Response(
    JSON.stringify({
      numRuns: user.data?.num_runs,
      jobs: chunks.map((chunk) => JSON.parse(chunk[0].pageContent)),
      email: applicantInfo?.email,
      firstName: applicantInfo?.name?.split(" ")[0],
    })
  );
}
