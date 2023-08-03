import { ApifyClient } from "apify-client";

export const apifyClient = new ApifyClient({
  token: process.env.APIFY_TOKEN as string,
});
