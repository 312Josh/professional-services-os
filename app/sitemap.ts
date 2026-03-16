import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://plumbing-os.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Dynamic proof pages
  try {
    const proofs = await prisma.proofAsset.findMany({
      where: { status: "ready" },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const proofPages: MetadataRoute.Sitemap = proofs.map((proof) => ({
      url: `${baseUrl}/proof/${proof.slug}`,
      lastModified: proof.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...proofPages];
  } catch {
    return staticPages;
  }
}
