import type { Metadata } from "next";
import { getTrustConfig } from "@/lib/trust-config";
import { buildSeoMetadata, buildJsonLd } from "@/lib/seo";
import "./globals.css";

const trust = getTrustConfig();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://plumbing-os.vercel.app";

export const metadata: Metadata = buildSeoMetadata(trust, baseUrl);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildJsonLd({ ...trust, url: baseUrl });

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
