import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const ADMIN_COOKIE = "ssf_admin_session";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Defense-in-depth for the admin panel: bounce unauthenticated navigations to
  // login early (pages/actions still verify the JWT via getSession). The login
  // page itself stays reachable.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!req.cookies.has(ADMIN_COOKIE)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return intl(req);
}

export const config = {
  // Run on everything except API routes, Next internals, and static files.
  // (Admin IS included now so the guard above runs.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
