import { NextResponse } from "next/server";
import { createLeadAction } from "@/lib/actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  await createLeadAction(formData);

  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
