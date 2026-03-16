import { appConfig } from "@/lib/app-config";
import whitelabel from "@/white-label.config.json";

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}

export interface TrustBadge {
  label: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TrustConfig {
  companyName: string;
  tagline: string;
  phone: string;
  serviceArea: string;
  yearsInBusiness: number;
  responseTimeMinutes: number;
  badges: TrustBadge[];
  reviews: Review[];
  services: string[];
  faq: FaqItem[];
}

export function getTrustConfig(): TrustConfig {
  return {
    companyName: process.env.TRUST_COMPANY_NAME || whitelabel.brand.companyName || appConfig.brand.businessName,
    tagline: process.env.TRUST_TAGLINE || whitelabel.brand.tagline || "Fast. Reliable. Guaranteed.",
    phone: process.env.TRUST_PHONE || whitelabel.brand.phone || "(555) 123-4567",
    serviceArea: process.env.TRUST_SERVICE_AREA || whitelabel.brand.serviceArea || "Local Area",
    yearsInBusiness: parseInt(process.env.TRUST_YEARS_IN_BUSINESS || String(whitelabel.brand.yearsInBusiness || 10)),
    responseTimeMinutes: parseInt(process.env.TRUST_RESPONSE_TIME_MINUTES || String(whitelabel.operations.responseTimeMinutes || 15)),
    badges: whitelabel.trustBadges || [],
    reviews: whitelabel.reviews || [],
    services: whitelabel.services || [],
    faq: (whitelabel as any).faq || [],
  };
}
