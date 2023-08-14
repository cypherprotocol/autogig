import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "es", "fr", "it", "zh", "de", "ko"],

  defaultLocale: "en",
});

export default authMiddleware({
  beforeAuth: (req) => {
    if (req.url.includes("/api")) {
      return;
    } else {
      return intlMiddleware(req);
    }
  },
  publicRoutes: [
    "/",
    "/blog(.*)",
    "/:locale((?!find|.*/find).*)",
    "/:locale/blog(.*)",
    "/:locale/sign-in",
  ],
});

// make sure the middleware only runs when
// the requested url starts with `/templates`
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
