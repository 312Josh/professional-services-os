/**
 * Proof Asset Generator
 * 
 * Takes prospect config, generates a white-label config 
 * that renders a personalized landing page.
 */

type ProofInput = {
  business_name: string;
  niche: string;
  city: string;
  state: string;
  phone: string;
  website?: string;
  pain_points?: string[];
  rep_name?: string;
  rep_booking_link?: string;
};

type FaqItem = { question: string; answer: string };

type NicheConfig = {
  services: string[];
  trustBadges: { label: string; icon: string }[];
  reviews: { name: string; service: string; text: string; rating: number; date: string }[];
  accentColor: string;
  faq: FaqItem[];
};

const NICHE_CONFIGS: Record<string, NicheConfig> = {
  garage_door: {
    services: ["Garage Door Repair", "Garage Door Installation", "Spring Replacement", "Opener Repair", "Emergency Service", "Preventive Maintenance"],
    trustBadges: [
      { label: "Licensed & Insured", icon: "🛡️" },
      { label: "Same-Day Service", icon: "⚡" },
      { label: "Free Estimates", icon: "💰" },
      { label: "All Brands Serviced", icon: "🔧" },
      { label: "Satisfaction Guaranteed", icon: "⭐" },
      { label: "24/7 Emergency", icon: "🚨" },
    ],
    reviews: [
      { name: "Mike R.", service: "Spring Replacement", text: "Broken spring at 7am. They were here by 9. Professional, fast, fair price. Highly recommend.", rating: 5, date: "2 weeks ago" },
      { name: "Sarah T.", service: "Opener Repair", text: "Our opener died on the coldest day of the year. Fixed same day. Great communication throughout.", rating: 5, date: "1 month ago" },
      { name: "David L.", service: "New Installation", text: "Installed a beautiful new door. Came in on budget. Clean work. Would hire again in a heartbeat.", rating: 5, date: "3 weeks ago" },
      { name: "Jennifer K.", service: "Emergency Repair", text: "Door came off the track at 10pm. They answered the phone and had someone out within an hour.", rating: 4, date: "1 month ago" },
    ],
    accentColor: "#1a5276",
    faq: [
      { question: "How fast can you repair my garage door?", answer: "We offer same-day service for most repairs. Our technicians carry common parts on their trucks so most repairs are completed in a single visit." },
      { question: "Do you service all garage door brands?", answer: "Yes. We service all major brands including LiftMaster, Chamberlain, Genie, Clopay, Amarr, and Wayne Dalton." },
      { question: "How much does a garage door spring replacement cost?", answer: "Spring replacement typically costs between $150-$350 depending on the type and size. We provide a free estimate before any work begins." },
      { question: "Are your technicians licensed and insured?", answer: "Yes. Every technician is fully licensed, insured, and background-checked for your safety and peace of mind." },
      { question: "Do you offer emergency garage door repair?", answer: "Yes. We offer 24/7 emergency service. If your garage door is stuck open or poses a security risk, call us anytime." },
    ],
  },
  plumbing: {
    services: ["Plumbing", "HVAC", "Drain Cleaning", "Water Heaters", "Sewer & Water Lines", "Emergency Service"],
    trustBadges: [
      { label: "Licensed & Insured", icon: "🛡️" },
      { label: "Background Checked", icon: "✅" },
      { label: "Satisfaction Guaranteed", icon: "⭐" },
      { label: "Up-Front Pricing", icon: "💰" },
      { label: "Same-Day Service", icon: "⚡" },
      { label: "24/7 Emergency", icon: "🚨" },
    ],
    reviews: [
      { name: "Sarah M.", service: "Emergency Plumbing", text: "Called at 7am with a burst pipe. They were here by 7:30. Fixed it in under an hour. Saved my basement.", rating: 5, date: "2 weeks ago" },
      { name: "David K.", service: "HVAC Installation", text: "Best HVAC company I've worked with. Installed a new furnace, explained everything, cleaned up perfectly.", rating: 5, date: "1 month ago" },
      { name: "Jennifer R.", service: "Drain Cleaning", text: "Third time using them. Always on time, always fair pricing. My go-to for anything plumbing.", rating: 5, date: "3 weeks ago" },
    ],
    accentColor: "#0b6a8f",
    faq: [
      { question: "How fast do you respond to service calls?", answer: "We respond within 15 minutes to all service requests. Our technicians are stationed throughout the area for fast response." },
      { question: "Do you offer emergency plumbing service?", answer: "Yes. We offer 24/7 emergency service for burst pipes, sewer backups, and no-heat emergencies." },
      { question: "Are your plumbers licensed?", answer: "Yes. Every technician is fully licensed, insured, and background-checked." },
      { question: "Do you provide free estimates?", answer: "Yes. We provide free, no-obligation estimates with upfront pricing before any work begins." },
    ],
  },
  electrical: {
    services: ["Electrical Repair", "Panel Upgrades", "Wiring", "Lighting Installation", "EV Charger Install", "Emergency Service"],
    trustBadges: [
      { label: "Licensed Master Electrician", icon: "🛡️" },
      { label: "Code Compliant", icon: "✅" },
      { label: "Free Estimates", icon: "💰" },
      { label: "Same-Day Service", icon: "⚡" },
      { label: "Satisfaction Guaranteed", icon: "⭐" },
      { label: "24/7 Emergency", icon: "🚨" },
    ],
    reviews: [
      { name: "Tom B.", service: "Panel Upgrade", text: "Upgraded our panel from 100A to 200A. Clean work, passed inspection first try. Very professional.", rating: 5, date: "2 weeks ago" },
      { name: "Lisa M.", service: "EV Charger", text: "Installed a Level 2 charger in our garage. Done in half a day. Price was exactly what they quoted.", rating: 5, date: "1 month ago" },
      { name: "Mark S.", service: "Wiring Repair", text: "Fixed a tricky wiring issue other electricians couldn't figure out. Fair price. Problem solved.", rating: 5, date: "3 weeks ago" },
    ],
    accentColor: "#b8860b",
    faq: [
      { question: "Are your electricians licensed?", answer: "Yes. All of our electricians are licensed master electricians with full insurance coverage." },
      { question: "Do you handle panel upgrades?", answer: "Yes. We specialize in panel upgrades from 100A to 200A or 400A to support modern electrical loads and EV chargers." },
      { question: "Can you install an EV charger?", answer: "Yes. We install Level 2 EV chargers for all vehicle makes. We handle permitting and inspection." },
      { question: "Do you offer free estimates?", answer: "Yes. We provide free electrical estimates with no obligation." },
    ],
  },
  hvac: {
    services: ["AC Repair", "Furnace Repair", "HVAC Installation", "Duct Cleaning", "Maintenance Plans", "Emergency Service"],
    trustBadges: [
      { label: "NATE Certified", icon: "🛡️" },
      { label: "All Brands Serviced", icon: "🔧" },
      { label: "Financing Available", icon: "💰" },
      { label: "Same-Day Service", icon: "⚡" },
      { label: "Satisfaction Guaranteed", icon: "⭐" },
      { label: "24/7 Emergency", icon: "🚨" },
    ],
    reviews: [
      { name: "Karen D.", service: "AC Repair", text: "AC died in July. They had parts on the truck and fixed it in 2 hours. Lifesavers.", rating: 5, date: "2 weeks ago" },
      { name: "Robert P.", service: "Furnace Install", text: "New furnace installed before winter. Fair price, clean install, runs perfectly.", rating: 5, date: "1 month ago" },
      { name: "Nancy W.", service: "Maintenance", text: "Signed up for their maintenance plan. Two visits a year, never had a breakdown since.", rating: 5, date: "3 weeks ago" },
    ],
    accentColor: "#c0392b",
    faq: [
      { question: "How fast can you get here for an AC emergency?", answer: "We offer same-day emergency service and respond within 15 minutes to most calls." },
      { question: "Do you service all HVAC brands?", answer: "Yes. We service all major brands including Carrier, Lennox, Trane, Rheem, Goodman, and more." },
      { question: "Do you offer maintenance plans?", answer: "Yes. Our annual maintenance plans include two tune-ups per year and priority scheduling for repairs." },
      { question: "How much does a new furnace cost?", answer: "New furnace installation typically ranges from $3,000-$7,000 depending on size and efficiency. We provide free estimates and financing options." },
    ],
  },
};

const DEFAULT_NICHE: NicheConfig = NICHE_CONFIGS.plumbing;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function generateSlug(businessName: string): string {
  return slugify(businessName) + "-" + Date.now().toString(36).slice(-4);
}

export function buildProofConfig(input: ProofInput) {
  const niche = NICHE_CONFIGS[input.niche] || DEFAULT_NICHE;
  const serviceArea = `${input.city}, ${input.state}`;
  const formattedPhone = formatPhone(input.phone);

  return {
    brand: {
      companyName: input.business_name,
      tagline: "Fast. Reliable. Guaranteed.",
      phone: formattedPhone,
      serviceArea,
      yearsInBusiness: 10,
      accentColor: niche.accentColor,
      website: input.website || "",
    },
    services: niche.services,
    trustBadges: niche.trustBadges,
    reviews: niche.reviews,
    painPoints: input.pain_points || [],
    faq: niche.faq || [],
    rep: {
      name: input.rep_name || "",
      bookingLink: input.rep_booking_link || "",
    },
    operations: {
      responseTimeMinutes: 15,
    },
  };
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
