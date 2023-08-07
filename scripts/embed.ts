import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import OpenAI from "openai";

loadEnvConfig("");

const generateEmbeddings = async (jobs: any[]) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey =
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  const client = createClient(supabaseUrl!, supabaseServiceRoleKey!);

  const vectorStore = await SupabaseVectorStore.fromTexts(
    jobs.map((job) => JSON.stringify(job)),
    Array(jobs.length).fill({
      type: "jobs",
    }),
    new OpenAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const result = await vectorStore.similaritySearch("Software Engineer", 1, {
    type: "jobs",
  });

  console.log(result);
};

(async () => {
  const jobs: any[] = JSON.parse(
    fs.readFileSync("lib/data/greenhouse.json", "utf8")
  );

  await generateEmbeddings(jobs);
})();
