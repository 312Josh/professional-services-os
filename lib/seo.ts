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

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  name: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}

export function buildFaqJsonLd(faq: FaqItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

export function buildServiceJsonLd(services: string[], provider: { name: string; phone: string; area: string }): object[] {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service,
    "provider": {
      "@type": "LocalBusiness",
      "name": provider.name,
      "telephone": provider.phone,
    },
    "areaServed": provider.area,
  }));
}

export function buildReviewJsonLd(reviews: ReviewItem[], businessName: string): object[] {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": { "@type": "Person", "name": review.name },
    "reviewRating": { "@type": "Rating", "ratingValue": String(review.rating), "bestRating": "5" },
    "reviewBody": review.text,
    "itemReviewed": { "@type": "LocalBusiness", "name": businessName },
  }));
}

export function buildLlmsTxt(input: SeoInput & { faq?: FaqItem[]; reviews?: ReviewItem[] }): string {
  const { companyName, tagline, phone, serviceArea, yearsInBusiness, responseTimeMinutes, services, reviews: revs } = input;
  const faq = input.faq || [];
  const reviews = revs || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  const lines = [
    `# ${companyName}`,
    `> ${tagline} Serving ${serviceArea}.`,
    "",
    "## About",
    `${companyName} is a licensed and insured service company serving ${serviceArea}. We offer ${responseTimeMinutes}-minute response times, 24/7 emergency service, and upfront pricing.`,
    "",
    "## Services",
    ...services.map((s) => `- ${s}`),
    "",
    "## Contact",
    `- Phone: ${phone}`,
    `- Service Area: ${serviceArea}`,
    "- Hours: 24/7 Emergency Available",
    "- Licensed & Insured: Yes",
    "",
    "## Key Facts",
    `- Response Time: ${responseTimeMinutes} minutes`,
    `- Years in Business: ${yearsInBusiness}+`,
    `- Customer Rating: ${avgRating}/5 (${reviews.length} reviews)`,
    "- Guarantee: Satisfaction Guaranteed",
  ];

  if (faq.length > 0) {
    lines.push("", "## FAQ");
    for (const item of faq) {
      lines.push(`### ${item.question}`, item.answer, "");
    }
  }

  return lines.join("\n");
}

export function buildLlmsFullTxt(input: SeoInput & { faq?: FaqItem[]; reviews?: ReviewItem[] }): string {
  const base = buildLlmsTxt(input);
  const reviews = (input.reviews || []) as ReviewItem[];
  
  if (reviews.length === 0) return base;

  const reviewLines = [
    "",
    "## Customer Reviews",
    "",
  ];
  for (const r of reviews) {
    reviewLines.push(`### ${r.name} — ${"⭐".repeat(r.rating)}`);
    reviewLines.push(`Service: ${r.service}`);
    reviewLines.push(`"${r.text}"`);
    reviewLines.push(`Date: ${r.date}`);
    reviewLines.push("");
  }

  return base + reviewLines.join("\n");
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
