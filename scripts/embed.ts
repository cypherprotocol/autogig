import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

loadEnvConfig("");

const generateEmbeddings = async (jobs: any[]) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: JSON.stringify(job),
    });

    const [{ embedding }] = embeddingResponse.data.data;

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        data: job,
        embedding: embedding,
      })
      .select("*");

    if (error) {
      console.log("error", error);
    } else {
      console.log("saved", i);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
};

(async () => {
  const jobs: any[] = JSON.parse(
    fs.readFileSync("lib/data/wellfound_2.json", "utf8")
  );

  await generateEmbeddings(jobs);
})();
