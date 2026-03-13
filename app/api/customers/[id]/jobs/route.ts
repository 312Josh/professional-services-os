import { NextResponse } from "next/server";
import { createJobAction } from "@/lib/actions";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  formData.set("customerId", params.id);

  await createJobAction(formData);

  return NextResponse.redirect(new URL(`/customers/${params.id}`, request.url), 303);
}
