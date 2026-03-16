import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildProofConfig, generateSlug } from "@/lib/proof-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.business_name || !body.city || !body.state || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields: business_name, city, state, phone" },
        { status: 400 }
      );
    }

    const slug = generateSlug(body.business_name);
    const config = buildProofConfig({
      business_name: body.business_name,
      niche: body.niche || "plumbing",
      city: body.city,
      state: body.state,
      phone: body.phone,
      website: body.website,
      pain_points: body.pain_points || [],
      rep_name: body.rep_name,
      rep_booking_link: body.rep_booking_link,
    });

    // Store in DB
    const proof = await prisma.proofAsset.create({
      data: {
        slug,
        businessName: body.business_name,
        niche: body.niche || "plumbing",
        city: body.city,
        state: body.state,
        phone: body.phone,
        website: body.website || null,
        painPoints: body.pain_points || [],
        repName: body.rep_name || null,
        repBookingLink: body.rep_booking_link || null,
        config: JSON.stringify(config),
        status: "ready",
        generatedAt: new Date(),
      },
    });

    // Build the page URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "https://plumbing-os.vercel.app";
    
    const pageUrl = `${baseUrl}/proof/${slug}`;

    // Update with page URL
    await prisma.proofAsset.update({
      where: { id: proof.id },
      data: { pageUrl },
    });

    return NextResponse.json({
      page_url: pageUrl,
      slug,
      generated_at: proof.generatedAt?.toISOString(),
      status: "ready",
      // Video recording is async — would be triggered separately
      // via a background job using Playwright
      video_url: null,
      screenshot_url: null,
    });
  } catch (error: any) {
    console.error("[generate-proof] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate proof asset" },
      { status: 500 }
    );
  }
}

// List existing proof assets
export async function GET() {
  const proofs = await prisma.proofAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      slug: true,
      businessName: true,
      niche: true,
      city: true,
      state: true,
      pageUrl: true,
      videoUrl: true,
      status: true,
      generatedAt: true,
    },
  });

  return NextResponse.json({ proofs });
}
