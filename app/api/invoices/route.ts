import { NextResponse } from "next/server";
import { createInvoiceAction } from "@/lib/actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  await createInvoiceAction(formData);

  return NextResponse.redirect(new URL("/invoices", request.url), 303);
}
