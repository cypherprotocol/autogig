import { getBucket } from "@/lib/ab-testing";
import { HOME_BUCKETS } from "@/lib/buckets";
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Route = {
  page: string;
  cookie: string;
  buckets: readonly string[];
};

const ROUTES: Record<string, Route | undefined> = {
  "/": {
    page: "",
    cookie: "bucket-home",
    buckets: HOME_BUCKETS,
  },
  // "/marketing": {
  //   page: "/marketing",
  //   cookie: "bucket-marketing",
  //   buckets: MARKETING_BUCKETS,
  // },
};

export default authMiddleware({
  beforeAuth: (req) => {
    const { pathname } = req.nextUrl;
    console.log(pathname);
    const route = ROUTES[pathname];

    if (!route) return;

    // Get the bucket from the cookie
    let bucket = req.cookies.get(route.cookie)?.value;
    let hasBucket = !!bucket;

    // If there's no active bucket in cookies or its value is invalid, get a new one
    if (!bucket || !route.buckets.includes(bucket as any)) {
      bucket = getBucket(route.buckets);
      hasBucket = false;
    }

    // Create a rewrite to the page matching the bucket
    const url = req.nextUrl.clone();
    url.pathname = `${route.page}/${bucket}`;
    const res = NextResponse.rewrite(url);

    // Add the bucket to the response cookies if it's not there
    // or if its value was invalid
    if (!hasBucket) {
      res.cookies.set(route.cookie, bucket);
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
