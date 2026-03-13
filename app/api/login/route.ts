import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, sanitizeRedirectPath, verifyPassword } from "@/lib/auth";

function redirectWithinRequest(request: NextRequest, path: string): URL {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  return url;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = (formData.get("email") || "").toString().trim().toLowerCase();
  const password = (formData.get("password") || "").toString();
  const nextPath = sanitizeRedirectPath((formData.get("next") || "").toString());

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    const loginUrl = redirectWithinRequest(request, "/login");
    loginUrl.searchParams.set("error", "Invalid credentials");
    if (nextPath) {
      loginUrl.searchParams.set("next", nextPath);
    }

    return NextResponse.redirect(loginUrl, 303);
  }

  await createSession(admin.id);
  return NextResponse.redirect(redirectWithinRequest(request, nextPath || "/dashboard"), 303);
}
