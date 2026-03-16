import { getTrustConfig } from "@/lib/trust-config";
import { buildLlmsFullTxt } from "@/lib/seo";

export async function GET() {
  const trust = getTrustConfig();
  const content = buildLlmsFullTxt({
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
