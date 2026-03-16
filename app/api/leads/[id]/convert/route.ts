import { NextResponse } from "next/server";
import { convertLeadToCustomerAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.formData().catch(() => new FormData());
  const formData = new FormData();
  formData.set("leadId", params.id);
  if (body.get("bookJob") === "1") formData.set("bookJob", "1");

  try {
    await convertLeadToCustomerAction(formData);
  } catch (e: any) {
    // convertLeadToCustomerAction uses redirect() which throws NEXT_REDIRECT
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
