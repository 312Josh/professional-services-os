import { prisma } from "@/lib/prisma";
import { buildLlmsFullTxt } from "@/lib/seo";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const proof = await prisma.proofAsset.findUnique({ where: { slug: params.slug } });
  if (!proof) {
    return new Response("Not found", { status: 404 });
  }

  const config = JSON.parse(proof.config);
  const content = buildLlmsFullTxt({
    companyName: config.brand.companyName,
    tagline: config.brand.tagline,
    phone: config.brand.phone,
    serviceArea: config.brand.serviceArea,
    yearsInBusiness: config.brand.yearsInBusiness,
    responseTimeMinutes: config.operations.responseTimeMinutes,
    services: config.services,
    reviews: config.reviews,
    faq: config.faq || [],
  });

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
