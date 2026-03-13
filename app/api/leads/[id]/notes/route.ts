import { NextResponse } from "next/server";
import { addLeadNoteAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  formData.set("leadId", params.id);
  await addLeadNoteAction(formData);

  return NextResponse.redirect(new URL("/leads", request.url), 303);
}
