import fs from "fs";
import { getJson } from "serpapi";

type GoogleJobsListingParameters = {
  q: string;
  api_key: string;
  engine?: string;
};

const params = {
  q: "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIiwiaHRpZG9jaWQiOiJ5Vy1laV9FQ3Y3Z0FBQUFBQUFBQUFBPT0iLCJnbCI6InVzIiwiaGwiOiJlbiIsImZjIjoiRXZjQkNyY0JRVUYwVm14aVJETmtXVmxsYm5SNVNqZFVNM3BEVkd0d1drcFdZVXRzTTNOQmFIaHVPVEpXWWsxbGVsRldiMGxYVjBWdUxVdzNYMlF5V0VKTVpEaDRMVkZ6Umtwek5qSklaRkJtVTJReU5FbGxZa0ZDWnpCemVUY3lYemc1UkU5blNIWlpRVnBRU1doMFJHMXljRk50VkhCemJsOUxjbUprYURKNU4ybE5hMmt5Vmpkc2RuUmpORnB3VkcwemEzUmFTV3RZYWxGcmFHRjJkek0yTVcxeGNGbGliM2xCWmtveVl6ZDJRMTlrYTB0alYzQkpjbVZ2RWhkSVNHVnNXVFpFY2toTU1tOXhkSE5RYms1MVIzRkJaeG9pUVVSVmVVVkhaV2xpVmxaaVgxRnRkbXRrVmpaVWQxVnVhbWsxYW5KT2QyaE9adyIsImZjdiI6IjMiLCJmY19pZCI6ImZjXzEiLCJhcHBseV9saW5rIjp7InRpdGxlIjoiLm5GZzJlYntmb250LXdlaWdodDo1MDB9LkJpNkRkY3tmb250LXdlaWdodDo1MDB9QXBwbHkgZGlyZWN0bHkgb24gSW5kZWVkIiwibGluayI6Imh0dHBzOi8vd3d3LmluZGVlZC5jb20vdmlld2pvYj9qaz03ZTA0YWYyNmIyZGE2NjljXHUwMDI2dXRtX2NhbXBhaWduPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX3NvdXJjZT1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9tZWRpdW09b3JnYW5pYyJ9fQ",
  api_key: process.env.SERP_API_KEY,
  engine: "google_jobs_listing",
} satisfies GoogleJobsListingParameters;

async function main() {
  try {
    // Read jobs from the JSON file
    const jobsRawData = fs.readFileSync("scripts/jobs.json", "utf8");
    const jobs: any[] = JSON.parse(jobsRawData);

    for (const job of jobs) {
      const jobId = job.job_id;
      const jobResult = await getJobResult(jobId);
      job["job_link"] = jobResult[0].link;
    }

    fs.writeFileSync("scripts/jobs.json", JSON.stringify(jobs));

    // You can access the updated jobs array here with the "result" field added for each job.
    console.log(jobs);
  } catch (error) {
    console.error(error);
  }
}

async function getJobResult(jobId: string) {
  const jobParams: GoogleJobsListingParameters = {
    q: `${jobId}`,
    api_key: params.api_key,
    engine: "google_jobs_listing",
  };

  try {
    const jobResponse = await getJson("google_jobs_listing", jobParams);
    console.log(jobResponse);
    return jobResponse["apply_options"];
  } catch (error) {
    console.error(`Error fetching job result for ID ${jobId}:`, error);
    return null;
  }
}

main();
