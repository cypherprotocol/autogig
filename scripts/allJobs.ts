import fs from "fs";
import { getJson } from "serpapi";

type GoogleJobsParameters = {
  q: string;
  gl: string;
  hl: string;
  api_key: string;
  engine?: string;
  location?: string;
  start?: number;
};

const apiKey =
  "88b22151dca1a91d8302601288e37b4fda05dc5554f35c37ddf3e31b66063967"; // Replace with your actual API key
const queries = ["software engineer", "smart contract engineer"]; // Add more queries if needed
const locations = [
  "San Francisco, Bay Area, United States",
  "Sunnyvale, California, United States",
  "Mountain View, California, United States",
  "Palo Alto, California, United States",
  "Los Angeles, California, United States",
  "New York, New York, United States",
  "Seattle, Washington, United States",
  "Austin, Texas, United States",
  "Chicago, Illinois, United States",
  "Boston, Massachusetts, United States",
  "Washington, District of Columbia, United States",
  "Atlanta, Georgia, United States",
  "Denver, Colorado, United States",
  "San Diego, California, United States",
  "San Jose, California, United States",
]; // Add more locations if needed
const maxIterations = 2000;
const startSpacing = 30;

async function main() {
  try {
    const responses = [];

    for (const query of queries) {
      for (const location of locations) {
        for (
          let start = 0;
          start < maxIterations * startSpacing;
          start += startSpacing
        ) {
          const params: GoogleJobsParameters = {
            q: query,
            gl: "us",
            hl: "en",
            api_key: apiKey,
            engine: "google_jobs",
            location: location,
            start: start,
          };

          const response = await getJson(params);
          if (!response["jobs_results"]) break;
          responses.push(...response["jobs_results"]);

          console.log(`Iteration ${start / startSpacing + 1} done.`);
        }
      }
    }

    fs.writeFileSync("scripts/jobs.json", JSON.stringify(responses));
    console.log("All responses saved to jobs.json");
  } catch (error) {
    console.error(error);
  }
}

main();
