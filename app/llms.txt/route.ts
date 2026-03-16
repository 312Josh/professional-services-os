import { getTrustConfig } from "@/lib/trust-config";
import { buildLlmsTxt } from "@/lib/seo";

export async function GET() {
  const trust = getTrustConfig();
  const content = buildLlmsTxt({
    ...trust,
    faq: trust.faq,
    reviews: trust.reviews,
  });

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
