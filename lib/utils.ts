import supabase from "@/lib/supabase";
import { Repositories } from "@/lib/types";
import axios from "axios";
import { load } from "cheerio";
import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
); // 7-character random string

export const getPortfolio = async (
  portfolio: string | undefined
): Promise<string> => {
  let portfolioText = "";

  if (portfolio) {
    const response = await axios.get(portfolio);
    const html = response.data;

    const $ = load(html);

    const text = $("body").text();

    console.log("text", text);

    portfolioText = text;
  }

  return portfolioText;
};

export const getRepos = async (
  github: string | undefined
): Promise<Repositories[] | undefined> => {
  let githubId = 0;

  if (github) {
    // If user already exists, get their repositories from database
    const { data: githubData } = await supabase
      .from("github")
      .select("*")
      .eq("name", github);

    if (githubData && githubData.length > 0) {
      githubId = githubData[0].id;

      const { data: repositories } = await supabase
        .from("repository")
        .select("name, language_data, description")
        .eq("user_id", githubId);

      if (repositories && repositories.length > 0) {
        return repositories;
      } else {
        return [];
      }
    } else {
      let githubRepos: Repositories[] = [];

      // If user does not exist, create them and their repositories
      console.log("github does not exist");
      const githubUser = await supabase
        .from("github")
        .insert([
          {
            name: github,
          },
        ])
        .select();

      if (githubUser.data) {
        githubId = githubUser.data[0].id;
      }

      // STEP 2: Get revelant information on user based on github from resume
      const result = await fetch(
        `https://api.github.com/users/${github}/repos`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            // Authorization: `Bearer ${ghToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      ).then((res) => res.json());

      let top3Repos;

      if (result.message) {
        return undefined;
      } else {
        top3Repos = (result as any[])
          .sort((a: any, b: any) => {
            return b.stargazers_count - a.stargazers_count;
          })
          .slice(0, 3);
      }

      // const userRepos = await octokit.rest.repos.listForUser({
      //   username: github,
      // });

      // const top3Repos = userRepos.data
      //   .filter((repo) => !!repo.stargazers_count) // Filter out repos without stars count
      //   .sort((a, b) => b.stargazers_count! - a.stargazers_count!) // Sort in descending order
      //   .slice(0, 3); // Take the top 3

      for (const repo of top3Repos) {
        try {
          const repoLanguages = await fetch(
            `https://api.github.com/repos/${github}/${repo.name}/languages`,
            {
              headers: {
                Accept: "application/vnd.github+json",
                // Authorization: `Bearer ${ghToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
              },
            }
          ).then((res) => res.json());

          const { error } = await supabase.from("repository").insert([
            {
              name: repo.name,
              description: repo.description,
              language_data: repoLanguages,
              user_id: githubUser?.data?.[0]?.id,
            },
          ]);

          githubRepos.push({
            name: repo.name,
            description: repo.description,
            language_data: repoLanguages.data,
          });

          if (error) {
            console.log("Error storing data in database:", error);
          }
        } catch (e) {
          console.log(e);
        }
      }

      return githubRepos;
    }
  } else {
    return undefined;
  }
};

export const convertToReadable = (data: Repositories[]): string => {
  const text = data
    .map((repo) => {
      return `Repository: ${repo.name}, Description: ${
        repo.description
      }, Languages: ${
        repo.language_data ? Object.keys(repo.language_data).join(", ") : ""
      } `;
    })
    .join("\n");

  return text;
};
