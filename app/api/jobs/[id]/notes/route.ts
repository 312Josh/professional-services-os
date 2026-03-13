import { NextResponse } from "next/server";
import { addJobNoteAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  formData.set("jobId", params.id);
  await addJobNoteAction(formData);

  return NextResponse.redirect(new URL("/jobs", request.url), 303);
}
