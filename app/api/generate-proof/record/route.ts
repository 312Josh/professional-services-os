import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/generate-proof/record
 * 
 * Triggers Playwright screen recording for a proof asset.
 * This runs locally (not on Vercel serverless) because Playwright
 * needs a real browser. Call this from the local machine or a 
 * background worker.
 * 
 * Body: { slug: string }
 * Returns: { video_url: string, screenshot_url: string }
 */
export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const proof = await prisma.proofAsset.findUnique({ where: { slug } });
    if (!proof) {
      return NextResponse.json({ error: "Proof asset not found" }, { status: 404 });
    }

    if (!proof.pageUrl) {
      return NextResponse.json({ error: "Proof page not generated yet" }, { status: 400 });
    }

    // Mark as generating
    await prisma.proofAsset.update({
      where: { slug },
      data: { status: "generating" },
    });

    // Playwright recording happens on the local machine, not serverless
    // This endpoint just stores the URLs after recording is done externally
    // For now, return the page URL and a placeholder for the recording
    
    return NextResponse.json({
      message: "Recording must be triggered from a local machine with Playwright installed.",
      page_url: proof.pageUrl,
      slug: proof.slug,
      command: `npx tsx scripts/record-proof.ts ${proof.slug}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
