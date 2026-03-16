/**
 * Record a proof asset walkthrough using Playwright.
 * 
 * Usage: npx tsx scripts/record-proof.ts <slug>
 * 
 * Captures:
 * 1. Full-page screenshot (PNG)
 * 2. 20-second scroll-through video (WebM)
 * 
 * Outputs to: public/recordings/<slug>.png and public/recordings/<slug>.webm
 */

import { chromium } from "playwright";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

const BASE_URL = process.env.BASE_URL || "https://plumbing-os.vercel.app";

async function recordProof(slug: string) {
  const outputDir = join(process.cwd(), "public", "recordings");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const pageUrl = `${BASE_URL}/proof/${slug}`;
  const screenshotPath = join(outputDir, `${slug}.png`);
  const videoDir = join(outputDir, "videos");
  if (!existsSync(videoDir)) {
    mkdirSync(videoDir, { recursive: true });
  }

  console.log(`Recording proof: ${pageUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  try {
    // Navigate to the proof page
    await page.goto(pageUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Take full-page screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);

    // Scroll through the page slowly for the video
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = 720;
    const steps = Math.ceil(scrollHeight / viewportHeight);
    const stepDuration = 18000 / Math.max(steps, 1); // ~18 seconds of scrolling

    for (let i = 0; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), i * viewportHeight);
      await page.waitForTimeout(stepDuration);
    }

    // Pause at the bottom for 2 seconds
    await page.waitForTimeout(2000);

    // Close context to save the video
    const video = page.video();
    await context.close();

    if (video) {
      const videoPath = await video.path();
      const finalVideoPath = join(outputDir, `${slug}.webm`);
      const { renameSync } = await import("fs");
      renameSync(videoPath, finalVideoPath);
      console.log(`Video saved: ${finalVideoPath}`);
    }

    await browser.close();

    console.log(`\nDone. Files:`);
    console.log(`  Screenshot: /recordings/${slug}.png`);
    console.log(`  Video:      /recordings/${slug}.webm`);
    console.log(`\nTo serve these, redeploy or use them locally.`);

    return {
      screenshot: `/recordings/${slug}.png`,
      video: `/recordings/${slug}.webm`,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// CLI entry
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npx tsx scripts/record-proof.ts <slug>");
  process.exit(1);
}

recordProof(slug)
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
