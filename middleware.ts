import { NextResponse, type NextRequest } from "next/server";
import { appConfig } from "@/lib/app-config";

const SESSION_COOKIE_NAME = appConfig.auth.sessionCookieName;

const PROTECTED_PREFIXES = ["/dashboard", "/leads", "/customers", "/jobs", "/invoices", "/activity"] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/customers/:path*", "/jobs/:path*", "/invoices/:path*", "/activity/:path*"]
};
