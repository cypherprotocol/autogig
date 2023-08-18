import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import OpenAI from "openai";

loadEnvConfig("");

const generateEmbeddings = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey =
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  const client = createClient(supabaseUrl!, supabaseServiceRoleKey!);

  const jobs = await client
    .from("documents")
    .select("*")
    .eq("metadata->>type", "new_jobs_2")
    .order("content", { ascending: true });

  console.log(jobs?.data?.[0]);

  if (jobs.data) {
    for (let i = 0; i < jobs.data.length; i++) {
      const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
        client: client,
        tableName: "documents",
      });

      // console.log(jobs[i]);

      const matchingJobs = await vectorStore.similaritySearchWithScore(
        JSON.stringify(jobs.data[i].content),
        3,
        {
          type: "new_jobs_2",
        }
      );

      // Delete all matching jobs except the first one
      for (let j = 1; j < matchingJobs.length; j++) {
        console.log(matchingJobs[j][1]);
        if (matchingJobs[j][1] > 0.95) {
          await client
            .from("documents")
            .delete()
            .match({ content: matchingJobs[j][0].pageContent });
        }
      }
    }
  }

  //   Create batches of 10 jobs
  //   for (let i = 0; i < jobs.length; i += 10) {
  //     const batch = jobs.slice(i, i + 10);

  //     const vectorStore = await SupabaseVectorStore.fromTexts(
  //       batch.map((job) => JSON.stringify(job)),
  //       Array(batch.length).fill({
  //         type: "new_jobs_2",
  //       }),
  //       new OpenAIEmbeddings({
  //         batchSize: 10,
  //       }),
  //       {
  //         client,
  //         tableName: "documents",
  //         queryName: "match_documents",
  //       }
  //     );
  //   }
};

(async () => {
  const jobs: any[] = JSON.parse(
    fs.readFileSync("lib/data/newjobs3.json", "utf8")
  );

  await generateEmbeddings();
})();
