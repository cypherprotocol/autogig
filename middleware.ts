import { authMiddleware } from "@clerk/nextjs";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

export default authMiddleware({
  beforeAuth: (req, res) => {
    if (req.nextUrl.pathname.startsWith("/ingest")) {
      const hostname = "app.posthog.com"; // or 'eu.posthog.com'

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("host", hostname);

      let url: NextURL = req.nextUrl.clone();
      url.protocol = "https";
      url.hostname = hostname;
      url.port = "443";
      url.pathname = url.pathname.replace(/^\/ingest/, "");

      return NextResponse.rewrite(url, {
        headers: requestHeaders,
      });
    }
  },
  publicRoutes: ["/", "/ingest"],
  // debug: true,
});

// make sure the middleware only runs when
// the requested url starts with `/templates`
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// const THRESHOLD = 0.5; // initial threshold for the new variant (50%)
// const COOKIE_NAME = "tm_var"; // name of the cookie to store the variant

// export function middleware(req: NextRequest) {
//   // get the variant from the cookie
//   // if not found, randomly set a variant based on threshold
//   const variant =
//     req.cookies.get(COOKIE_NAME)?.value ||
//     (Math.random() < THRESHOLD ? "new" : "old");

//   const url = req.nextUrl.clone();

//   // if it's the old variant, rewrite to the old templates marketplace
//   if (variant === "old") {
//     // url.pathname = "/styled";
//   }

//   const res = NextResponse.rewrite(url);

//   // set the variant in the cookie if not already set
//   if (!req.cookies.get(COOKIE_NAME)) {
//     res.cookies.set(COOKIE_NAME, variant);
//   }
//   return res;
// }
