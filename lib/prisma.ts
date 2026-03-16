import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { existsSync } from "fs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  var dbInitialized: boolean | undefined;
}

function initDb(client: PrismaClient) {
  if (global.dbInitialized) return;
  global.dbInitialized = true;

  const dbUrl = process.env.DATABASE_URL || "";
  const isFileBased = dbUrl.startsWith("file:");
  if (!isFileBased) return;

  // Extract file path from DATABASE_URL (file:/tmp/dev.db → /tmp/dev.db)
  const filePath = dbUrl.replace(/^file:/, "");
  const dbExists = existsSync(filePath);

  if (!dbExists) {
    try {
      console.log("[db-init] DB not found at", filePath, "— running setup...");
      execSync("npx prisma db push --accept-data-loss", {
        env: { ...process.env },
        stdio: "inherit",
        timeout: 30000,
      });
      execSync("node prisma/seed.js", {
        env: { ...process.env },
        stdio: "inherit",
        timeout: 30000,
      });
      console.log("[db-init] DB initialized and seeded.");
    } catch (e) {
      console.error("[db-init] Failed:", e);
    }
  }
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Auto-init DB in production if missing (Vercel /tmp SQLite pattern)
if (process.env.NODE_ENV === "production") {
  initDb(prisma);
}
