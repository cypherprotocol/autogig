import { User } from "next-auth";
import "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    twitter?: { accessToken: string; refreshToken?: string };
    github?: { accessToken: string; refreshToken?: string };
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
