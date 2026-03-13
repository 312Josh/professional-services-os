import { NextResponse } from "next/server";
import { addInvoiceNoteAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  formData.set("invoiceId", params.id);
  await addInvoiceNoteAction(formData);

  return NextResponse.redirect(new URL(`/invoices/${params.id}`, request.url), 303);
}
