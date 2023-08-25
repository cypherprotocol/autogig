import { autogigFunctions } from "@/app/api/find/functions";
import { parsePDF } from "@/lib/parse-pdf";
import supabase from "@/lib/supabase";
import { getRepos } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { nanoid } from "nanoid";
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

  const { fileName } = await req.json();

  const { data: resume, error } = await supabase.storage
    .from("autogig")
    .download(`resumes/${fileName}`);

  const id = nanoid();

  let githubForm: any;
  // if (formData.get("githubForm") !== null) {
  //   const githubFormValue = formData.get("githubForm") as string;
  //   githubForm = JSON.parse(githubFormValue) as z.infer<typeof formSchema>;
  // }

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
  });

  // Collect all data relevant to user looking for a job
  let profileInput: any;
  let applicantInfo: any;
  let resumeText = "";

  if (resume) {
    resumeText = await parsePDF(resume as File);

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
    20,
    {
      type: "new_jobs_2",
    }
  );

  return new Response(
    JSON.stringify({
      jobs: chunks.map((chunk) => JSON.parse(chunk[0].pageContent)),
    })
  );
}
