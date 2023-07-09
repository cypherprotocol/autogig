import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        switch (account.provider) {
          case "twitter":
            if (account.access_token) {
              token.twitter = { accessToken: account.access_token };
            }
            if (account.refresh_token && token.twitter) {
              token.twitter.refreshToken = account.refresh_token;
            }
            break;
          case "github":
            if (account.access_token) {
              token.github = { accessToken: account.access_token };
            }
            if (account.refresh_token && token.github) {
              token.github.refreshToken = account.refresh_token;
            }
            break;
        }
      }

      return token;
    },
  },
};
