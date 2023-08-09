import {
  EXPERIMENT,
  GROUP_PARAM_FALLBACK,
  UID_COOKIE,
} from "@/lib/statsig-api";
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Statsig from "statsig-node";
import { EdgeConfigDataAdapter } from "statsig-node-vercel";

const IS_UUID = /^[0-9a-f-]+$/i;
const dataAdapter = new EdgeConfigDataAdapter(
  process.env.EDGE_CONFIG_ITEM_KEY!
);

export default authMiddleware({
  beforeAuth: async (req) => {
    // Get the user ID from the cookie or get a new one
    let userId = req.cookies.get(UID_COOKIE)?.value;
    let hasUserId = !!userId;

    // If there's no active user ID in cookies or its value is invalid, get a new one
    if (!userId || !IS_UUID.test(userId)) {
      userId = crypto.randomUUID();
      hasUserId = false;
    }

    // pass data adapter in for edge compatibility
    await Statsig.initialize(process.env.STATSIG_SERVER_API_KEY!, {
      dataAdapter,
    });

    // get experiment that user is in
    const experiment = await Statsig.getExperiment(
      { userID: userId },
      EXPERIMENT
    );

    const bucket = experiment.get<string>("bucket", GROUP_PARAM_FALLBACK);

    // Clone the URL and change its pathname to point to a bucket
    const url = req.nextUrl.clone();
    url.pathname =
      req.nextUrl.pathname === "/" ? `/${bucket}` : req.nextUrl.pathname;

    // Response that'll rewrite to the selected bucket
    const res = NextResponse.rewrite(url);

    // Add the user ID to the response cookies if it's not there or if its value was invalid
    if (!hasUserId) {
      res.cookies.set(UID_COOKIE, userId, {
        maxAge: 60 * 60 * 24, // identify users for 24 hours
      });
    }

    return res;
  },
  publicRoutes: ["/"],
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
