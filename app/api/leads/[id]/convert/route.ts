import { NextResponse } from "next/server";
import { convertLeadToCustomerAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = new FormData();
  formData.set("leadId", params.id);

  await convertLeadToCustomerAction(formData);

  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
