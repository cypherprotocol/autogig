## Autogig

### `app` Folder

The `app` folder contains the Next.js application. The main pages included in this folder are not provided in the code snippets, but they are part of the application.

### `/app/api` Folder

The api folder contains two routes: `/find` and `/tip`.

#### `/find` Route

The `/find` route is responsible for matching users and their preferences with the best matching jobs. It includes functions such as `get_applicant_info` to retrieve applicant information from resumes based on provided parameters. The code for this route is not provided in the code snippets.

#### `/tip` Route

The `/tip` route utilizes OpenAI to generate tips for job candidates. It collects relevant data from the user's profile, such as resume and GitHub information, and sends it to OpenAI for generating a tip. The generated tip is then returned as a response.

### `scripts` Folder

The `scripts` folder contains additional scripts for manual job scraping. The `jobs.ts` script reads jobs from a JSON file, retrieves job results using the Google Jobs Listing API, and adds the job link to each job object. The updated jobs array can be accessed in the script.

### Stack

The stack being used in the codebase includes:

- OpenAI: Used for generating tips and completing chat prompts.
- Next.js: The framework used for building the web application.
- Tailwind CSS: A utility-first CSS framework used for styling the application.
- Supabase: A backend-as-a-service platform used for creating a vector store for job embeddings.
- Langchain: A library used for generating embeddings and working with vector stores.
