import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public lead intake endpoint — no auth required.
 * This is the customer-facing form submission.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const service = (formData.get("service") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name) {
      return NextResponse.redirect(new URL("/request?error=name", request.url), 303);
    }
    if (!phone && !email) {
      return NextResponse.redirect(new URL("/request?error=contact", request.url), 303);
    }

    await prisma.lead.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        serviceRequested: service || "General Inquiry",
        source: "website",
        status: "new",
      },
    });

    return NextResponse.redirect(new URL("/request/confirmation", request.url), 303);
  } catch (error) {
    console.error("[intake] Error:", error);
    return NextResponse.redirect(new URL("/request?error=server", request.url), 303);
  }
}
