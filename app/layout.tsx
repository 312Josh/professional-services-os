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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
        {serviceLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />}
        {reviewLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }} />}
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
