import { NextResponse } from "next/server";
import { updateLeadStatusAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  formData.set("leadId", params.id);
  await updateLeadStatusAction(formData);

  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
