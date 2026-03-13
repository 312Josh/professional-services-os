import { NextResponse } from "next/server";
import { sendInvoiceEmailAction } from "@/lib/actions";
import { buildInvoiceActionErrorNotice, isRedirectError, setInvoiceActionNotice } from "@/lib/invoice-action-notice";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const redirectUrl = new URL(`/invoices/${params.id}`, request.url);

  try {
    const formData = await request.formData();
    formData.set("invoiceId", params.id);
    const notice = await sendInvoiceEmailAction(formData);
    setInvoiceActionNotice(redirectUrl, notice);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    setInvoiceActionNotice(
      redirectUrl,
      buildInvoiceActionErrorNotice(error, "Demo invoice-email action failed.")
    );
  }

  return NextResponse.redirect(redirectUrl, 303);
}
