const { createClient } = require("@supabase/supabase-js");
const { readFile } = require("fs/promises");
import { Configuration, OpenAIApi } from "openai";
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

async function seed() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const data = JSON.parse(await readFile("./lib/data/wellfound.json"));

  for (let item of data) {
    const { error } = await supabase.from("jobs").insert([{ data: item }]);

    if (error) {
      console.error("Error inserting data: ", error);
    }
  }
}

seed();
