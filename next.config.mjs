/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    },
    outputFileTracingIncludes: {
      "/api/**": ["./prisma/seed.db"],
      "/dashboard/**": ["./prisma/seed.db"],
      "/leads/**": ["./prisma/seed.db"],
      "/customers/**": ["./prisma/seed.db"],
      "/invoices/**": ["./prisma/seed.db"],
      "/jobs/**": ["./prisma/seed.db"],
      "/activity/**": ["./prisma/seed.db"],
      "/login": ["./prisma/seed.db"],
    }
  }
};

export default nextConfig;
