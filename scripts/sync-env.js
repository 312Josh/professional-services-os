#!/usr/bin/env node
/**
 * Generates .env.local from white-label.config.json
 * Run: node scripts/sync-env.js
 * 
 * This bridges server-side config → client-side NEXT_PUBLIC_ env vars
 * so "use client" components can read brand data without hardcoding.
 */

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "white-label.config.json");
const envPath = path.join(__dirname, "..", ".env.local");

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Read existing .env.local to preserve non-NEXT_PUBLIC vars (like DATABASE_URL)
let existing = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) {
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1).replace(/^["']|["']$/g, "");
      // Keep non-NEXT_PUBLIC vars
      if (!key.startsWith("NEXT_PUBLIC_BRAND_")) {
        existing[key] = val;
      }
    }
  }
}

// Map config → env vars
const brandVars = {
  NEXT_PUBLIC_BRAND_NAME: config.brand?.companyName || "",
  NEXT_PUBLIC_BRAND_PHONE: config.brand?.phone || "",
  NEXT_PUBLIC_BRAND_TAGLINE: config.brand?.tagline || "",
  NEXT_PUBLIC_BRAND_AREA: config.brand?.serviceArea || "",
  NEXT_PUBLIC_BRAND_YEARS: String(config.brand?.yearsInBusiness || 10),
  NEXT_PUBLIC_BRAND_COLOR: config.brand?.accentColor || "#f59e0b",
  NEXT_PUBLIC_BRAND_COLOR_MUTED: config.brand?.accentColorMuted || "#2f4758",
  NEXT_PUBLIC_BRAND_RESPONSE_MIN: String(config.operations?.responseTimeMinutes || 15),
  NEXT_PUBLIC_BRAND_SERVICES: JSON.stringify(config.services || []),
  NEXT_PUBLIC_BRAND_TRUST_BADGES: JSON.stringify(config.trustBadges || []),
  NEXT_PUBLIC_BRAND_REVIEWS: JSON.stringify(config.reviews || []),
  NEXT_PUBLIC_BRAND_FAQ: JSON.stringify(config.faq || []),
  NEXT_PUBLIC_BRAND_DEMO_EMAIL: config.demo?.loginEmail || "",
  NEXT_PUBLIC_BRAND_DEMO_PASSWORD: config.demo?.loginPassword || "",
};

// Merge and write
const merged = { ...existing, ...brandVars };
const output = Object.entries(merged)
  .map(([key, val]) => `${key}="${val}"`)
  .join("\n");

fs.writeFileSync(envPath, output + "\n");
console.log(`✅ Synced ${Object.keys(brandVars).length} NEXT_PUBLIC_BRAND_ vars to .env.local`);
console.log(`   Source: white-label.config.json`);
console.log(`   Preserved ${Object.keys(existing).length} existing vars`);
