import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = "app.posthog.com"; // or 'eu.posthog.com'

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("host", hostname);

  let url = request.nextUrl.clone();
  url.protocol = "https";
  url.hostname = hostname;
  url.port = "443";
  url.pathname = url.pathname.replace(/^\/ingest/, "");

  return NextResponse.rewrite(url, {
    headers: requestHeaders,
  });
}

export const config = {
  matcher: "/ingest/:path*",
};
