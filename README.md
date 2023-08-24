## Autogig

### `app` Folder

The `app` folder contains the Next.js application.

### `/app/api` Folder

The api folder contains two routes: `/find` and `/tip`.

#### `/find` Route

The `/find` route is responsible for matching users and their preferences with the best matching jobs. It includes functions such as `get_applicant_info` to retrieve applicant information from resumes based on provided parameters.

#### `/tip` Route

The `/tip` route utilizes OpenAI to generate tips for job candidates. It collects relevant data from the user's profile, such as resume and GitHub information, and sends it to OpenAI for generating a tip. The generated tip is then returned as a response.

### `scripts` Folder

The `scripts` folder contains additional scripts for manual job scraping using SERPAPI and other APIs.

- `jobs.ts` script fetches direct job links from provided job_id
- `allJobs.ts` script fetches all jobs from SerpAPI with a provided query string and location query
- `embed.ts` script embeds all jobs into the Supabase database using vector embeddings
- `deduplicate.ts` removes all high similarity jobs from the database, ensuring that only unique jobs are stored

### Stack

The stack being used in the codebase includes:

- OpenAI: Used for generating tips and completing chat prompts.
- Next.js: The framework used for building the web application.
- Tailwind CSS: A utility-first CSS framework used for styling the application.
- Supabase: A backend-as-a-service platform used for creating a vector store for job embeddings.
- Langchain: A library used for generating embeddings and working with vector stores.
