import type { Metadata } from "next";
import { getTrustConfig } from "@/lib/trust-config";
import { buildSeoMetadata, buildJsonLd, buildFaqJsonLd, buildServiceJsonLd, buildReviewJsonLd } from "@/lib/seo";
import "./globals.css";

const trust = getTrustConfig();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://plumbing-os.vercel.app";

export const metadata: Metadata = buildSeoMetadata(trust, baseUrl);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const localBusiness = buildJsonLd({ ...trust, url: baseUrl });
  const faqLd = trust.faq.length > 0 ? buildFaqJsonLd(trust.faq) : null;
  const serviceLd = buildServiceJsonLd(trust.services, { name: trust.companyName, phone: trust.phone, area: trust.serviceArea });
  const reviewLd = buildReviewJsonLd(trust.reviews, trust.companyName);

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
        {serviceLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />}
        {reviewLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }} />}
      </head>
      <body>{children}</body>
    </html>
  );
}
