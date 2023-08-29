# Autogig

This is an application that makes it easy for job seekers to find and land interviews at their dream job.

It currently matches candidates with the best jobs based on their preferences (location, experience, and interests) and generates tips for job candidates to bolster their resume.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cypherprotocol/autogig)

Room for improvement:

- Fine tune the job matching algorithm to include more parameters
- Handle resume improvements within the PDF itself
- Auto-apply with AI

### Getting Started

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/cypherprotocol/autogig.git
cd autogig
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

#### Get a Supabase API Key

1. Create a [Supabase](https://supabase.com/) account
2. Create a new project
3. Go to Settings > API
4. Copy the API URL and API Key

#### Get SERPAPI Key to scrape jobs

1. Create a [SERPAPI](https://serpapi.com/) account
2. Copy the API Key
3. Modify the `allJobs.ts` script.
4. Run `pnpm run all-jobs` to scrape jobs
5. Run `pnpm run embed` to embed jobs into the vector store

### `scripts` Folder

The `scripts` folder contains additional scripts for manual job scraping using SERPAPI and other APIs.

- `jobs.ts` script fetches direct job links from provided job_id
- `allJobs.ts` script fetches all jobs from SerpAPI with a provided query string and location query
- `embed.ts` script embeds all jobs into the Supabase database using vector embeddings
- `deduplicate.ts` removes all high similarity jobs from the database, ensuring that only unique jobs are stored (needs improvement)

### Stack

The stack being used in the codebase includes:

- OpenAI: Used for generating tips and completing chat prompts.
- Next.js: The framework used for building the web application.
- Tailwind CSS: A utility-first CSS framework used for styling the application.
- Supabase: A backend-as-a-service platform used for creating a vector store for job embeddings.
- Langchain: A library used for generating embeddings and working with vector stores.

```

```
