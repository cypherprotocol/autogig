import { authMiddleware } from "@clerk/nextjs";
import { EdgeConfigDataAdapter } from "statsig-node-vercel";

const IS_UUID = /^[0-9a-f-]+$/i;
const dataAdapter = new EdgeConfigDataAdapter(
  process.env.EDGE_CONFIG_ITEM_KEY!
);

export default authMiddleware({
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
