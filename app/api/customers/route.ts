import { NextResponse } from "next/server";
import { createCustomerAction } from "@/lib/actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  await createCustomerAction(formData);

  return NextResponse.redirect(new URL("/customers", request.url), 303);
}
