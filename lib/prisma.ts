import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import { join } from "path";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  var dbInitialized: boolean | undefined;
}

function ensureDb() {
  if (global.dbInitialized) return;
  global.dbInitialized = true;

  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl.startsWith("file:")) return;

  const filePath = dbUrl.replace(/^file:/, "");
  if (existsSync(filePath)) return;

  // In production (Vercel), copy the bundled seed DB to /tmp
  const seedPaths = [
    join(process.cwd(), "prisma", "seed.db"),
    join(__dirname, "..", "prisma", "seed.db"),
    "/var/task/prisma/seed.db",
    "/var/task/.next/server/prisma/seed.db",
  ];

  for (const seedPath of seedPaths) {
    if (existsSync(seedPath)) {
      try {
        copyFileSync(seedPath, filePath);
        console.log(`[db-init] Copied seed DB from ${seedPath} to ${filePath}`);
        return;
      } catch (e) {
        console.error(`[db-init] Failed to copy from ${seedPath}:`, e);
      }
    }
  }

  console.error("[db-init] No seed DB found at:", seedPaths.join(", "));
}

// Initialize DB before creating the client
if (process.env.NODE_ENV === "production") {
  ensureDb();
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
