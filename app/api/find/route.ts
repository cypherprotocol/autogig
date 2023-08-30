import { autogigFunctions } from "@/app/api/find/functions";
import { parsePDF } from "@/lib/parse-pdf";
import supabase from "@/lib/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function removeNullCharacter(text) {
  return text.replace(/\u0000/g, "");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const resume = formData.get("resume") as File;

  const id = nanoid();

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "documents",
  });

  // Collect all data relevant to user looking for a job
  let profileInput: any;
  let applicantInfo: any;
  let resumeText = "";

  if (resume) {
    resumeText = await parsePDF(resume);
    resumeText = removeNullCharacter(resumeText);

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
      resume: resumeText,
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

  return new Response(
    JSON.stringify({
      jobs: chunks.map((chunk) => JSON.parse(chunk[0].pageContent)),
    })
  );
}
