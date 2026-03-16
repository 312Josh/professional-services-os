import { appConfig } from "@/lib/app-config";

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
}

// Default trust config — override via environment or config file
export function getTrustConfig(): TrustConfig {
  return {
    companyName: process.env.TRUST_COMPANY_NAME || appConfig.brand.businessName,
    tagline: process.env.TRUST_TAGLINE || "Fast. Reliable. Guaranteed.",
    phone: process.env.TRUST_PHONE || "(555) 123-4567",
    serviceArea: process.env.TRUST_SERVICE_AREA || "Chicago Metro Area",
    yearsInBusiness: parseInt(process.env.TRUST_YEARS_IN_BUSINESS || "12"),
    responseTimeMinutes: parseInt(process.env.TRUST_RESPONSE_TIME_MINUTES || "15"),
    badges: [
      { label: "Licensed & Insured", icon: "🛡️" },
      { label: "Background Checked", icon: "✅" },
      { label: "Satisfaction Guaranteed", icon: "⭐" },
      { label: "Up-Front Pricing", icon: "💰" },
      { label: "Same-Day Service", icon: "⚡" },
      { label: "24/7 Emergency", icon: "🚨" },
    ],
    reviews: [
      { name: "Sarah M.", rating: 5, text: "Called at 7am with a burst pipe. They were here by 7:30. Fixed it in under an hour. Saved my basement.", date: "2 weeks ago", service: "Emergency Plumbing" },
      { name: "David K.", rating: 5, text: "Best HVAC company I've worked with. Installed a new furnace, explained everything, cleaned up perfectly.", date: "1 month ago", service: "HVAC Installation" },
      { name: "Jennifer R.", rating: 5, text: "Third time using them. Always on time, always fair pricing. My go-to for anything plumbing.", date: "3 weeks ago", service: "Drain Cleaning" },
      { name: "Mike T.", rating: 4, text: "Quick response, professional crew. Fixed our water heater same day. Price was fair.", date: "1 month ago", service: "Water Heater Repair" },
      { name: "Lisa P.", rating: 5, text: "They replaced our entire sewer line. Massive job. Came in on budget and ahead of schedule.", date: "2 months ago", service: "Sewer Replacement" },
    ],
    services: (process.env.TRUST_SERVICES || "Plumbing,HVAC,Drain Cleaning,Water Heaters,Sewer & Water Lines,Emergency Service").split(",").map(s => s.trim()),
  };
}
