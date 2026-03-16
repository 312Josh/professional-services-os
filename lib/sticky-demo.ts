/**
 * Demo data generators for sticky engagement features.
 * All data is deterministic per-day so it looks fresh but consistent.
 */

const FIRST_NAMES = ["Sarah", "Mike", "Jennifer", "David", "Lisa", "Tom", "Karen", "Robert", "Nancy", "Mark", "Alice", "Derek", "Evelyn", "Bob", "Carla"];
const LAST_INITIALS = ["M", "T", "R", "K", "P", "B", "D", "W", "S", "L", "J", "C", "N", "F", "H"];

const SERVICE_MAP: Record<string, string[]> = {
  garage_door: ["Spring Replacement", "Opener Repair", "New Installation", "Emergency Repair", "Track Alignment", "Panel Replacement"],
  plumbing: ["Emergency Plumbing", "Drain Cleaning", "Water Heater Repair", "Sewer Repair", "Pipe Repair", "Leak Detection"],
  electrical: ["Panel Upgrade", "Outlet Repair", "EV Charger Install", "Wiring Repair", "Lighting Install", "Emergency Electrical"],
  hvac: ["AC Repair", "Furnace Repair", "Duct Cleaning", "Thermostat Install", "Maintenance Tune-Up", "Emergency HVAC"],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDemoLeadCount(): number {
  const rand = seededRandom(getDaySeed());
  return Math.floor(rand() * 5) + 2; // 2-6 leads today
}

export function getDemoResponseTime(): { avg: number; trend: "up" | "down" | "flat"; prevAvg: number } {
  const rand = seededRandom(getDaySeed());
  const avg = Math.floor(rand() * 15) + 8; // 8-22 min
  const prevAvg = avg + Math.floor(rand() * 10) - 3; // +/- variation
  const trend = avg < prevAvg ? "down" : avg > prevAvg ? "up" : "flat";
  return { avg, trend, prevAvg: Math.max(prevAvg, 5) };
}

export function getDemoMissedLeads(): number {
  const rand = seededRandom(getDaySeed());
  return Math.floor(rand() * 3); // 0-2 missed
}

export function getDemoActivityFeed(niche: string = "plumbing", count: number = 8): { text: string; time: string; type: "lead" | "response" | "review" | "booking" }[] {
  const rand = seededRandom(getDaySeed() + 42);
  const services = SERVICE_MAP[niche] || SERVICE_MAP.plumbing;
  const feed: { text: string; time: string; type: "lead" | "response" | "review" | "booking" }[] = [];

  for (let i = 0; i < count; i++) {
    const nameIdx = Math.floor(rand() * FIRST_NAMES.length);
    const name = `${FIRST_NAMES[nameIdx]} ${LAST_INITIALS[nameIdx]}.`;
    const service = services[Math.floor(rand() * services.length)];
    const minutesAgo = Math.floor(rand() * 120) + 1 + i * 30;
    const timeStr = minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.floor(minutesAgo / 60)}h ago`;
    const responseMin = Math.floor(rand() * 15) + 3;

    const roll = rand();
    if (roll < 0.35) {
      feed.push({ text: `New lead from ${name} — ${service}`, time: timeStr, type: "lead" });
    } else if (roll < 0.65) {
      feed.push({ text: `Responded to ${name} — ${responseMin} min response time ✅`, time: timeStr, type: "response" });
    } else if (roll < 0.85) {
      feed.push({ text: `${name} booked ${service}`, time: timeStr, type: "booking" });
    } else {
      const stars = Math.floor(rand() * 2) + 4; // 4-5 stars
      feed.push({ text: `⭐ New ${stars}-star review from ${name}`, time: timeStr, type: "review" });
    }
  }

  return feed.sort((a, b) => {
    const parseMin = (t: string) => t.includes("h") ? parseInt(t) * 60 : parseInt(t);
    return parseMin(a.time) - parseMin(b.time);
  });
}

export function getDemoCompetitorComparison(): { yours: number; industry: number; multiplier: string } {
  const resp = getDemoResponseTime();
  const industry = 47 * 60; // 47 hours in minutes
  const multiplier = Math.floor(industry / resp.avg);
  return { yours: resp.avg, industry, multiplier: `${multiplier}x` };
}

export function getDemoWeeklyDigest(): { leadsReceived: number; avgResponse: number; bookings: number; reviews: number; revenue: number } {
  const rand = seededRandom(getDaySeed() - 7);
  return {
    leadsReceived: Math.floor(rand() * 15) + 8,
    avgResponse: Math.floor(rand() * 12) + 8,
    bookings: Math.floor(rand() * 8) + 3,
    reviews: Math.floor(rand() * 3) + 1,
    revenue: Math.floor(rand() * 5000) + 2000,
  };
}
