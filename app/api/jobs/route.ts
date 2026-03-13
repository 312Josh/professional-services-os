import { NextResponse } from "next/server";
import { createJobAction } from "@/lib/actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  await createJobAction(formData);

  return NextResponse.redirect(new URL("/jobs", request.url), 303);
}
