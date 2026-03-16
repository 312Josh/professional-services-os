import type { Metadata } from "next";

export interface SeoInput {
  companyName: string;
  tagline: string;
  phone: string;
  serviceArea: string;
  yearsInBusiness: number;
  responseTimeMinutes: number;
  services: string[];
  reviews: { rating: number }[];
  url?: string;
}

export function buildSeoMetadata(input: SeoInput, url?: string): Metadata {
  const { companyName, tagline, phone, serviceArea, responseTimeMinutes, services } = input;

  const topServices = services.slice(0, 3).join(", ");
  const title = `${companyName} | ${topServices} | ${serviceArea}`;
  const description = `${tagline} ${topServices} in ${serviceArea}. ${responseTimeMinutes}-minute response. Licensed & insured. Call ${phone} for free estimates.`;

  const ogUrl = url || "";

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title: `${companyName} | ${serviceArea}`,
      description: `${tagline} ${responseTimeMinutes}-min response. Licensed & insured.`,
      type: "website",
      url: ogUrl || undefined,
      siteName: companyName,
    },
    twitter: {
      card: "summary_large_image",
      title: `${companyName} | ${serviceArea}`,
      description: `${tagline} Call ${phone} for service.`,
    },
  };
}

export function buildJsonLd(input: SeoInput & { url?: string }): object {
  const { companyName, phone, serviceArea, services, reviews, url } = input;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyName,
    "telephone": phone,
    "url": url || "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": serviceArea,
    },
    "areaServed": serviceArea,
    "serviceType": services,
    ...(reviews.length > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avgRating,
        "reviewCount": String(reviews.length),
      },
    }),
  };
}
