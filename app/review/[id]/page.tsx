export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/lib/app-config";
import { notFound } from "next/navigation";

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { customer: true }
  });

  if (!job) {
    notFound();
  }

  const accentColor = process.env.BRAND_ACCENT_COLOR || appConfig.brand.accentColor;
  const businessName = process.env.BUSINESS_NAME || appConfig.brand.businessName;
  const googleReviewUrl = process.env.GOOGLE_REVIEW_URL || "#";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`, color: "white", padding: "2rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{businessName}</h1>
        <p style={{ opacity: 0.8, margin: "0.25rem 0 0", fontSize: "0.875rem" }}>How did we do?</p>
      </header>

      <main style={{ maxWidth: 500, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⭐</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
            Thanks for choosing {businessName}
          </h2>
          <p style={{ color: "#6b7280", margin: "0 0 1.5rem", fontSize: "0.9375rem" }}>
            {job.customer.name}, we hope you&apos;re happy with your <strong>{job.title}</strong> service.
            Your feedback helps other homeowners find reliable service.
          </p>

          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: accentColor,
              color: "white",
              padding: "0.875rem 2.5rem",
              borderRadius: 999,
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              marginBottom: "0.75rem"
            }}
          >
            ⭐ Leave a Google Review
          </a>

          <p style={{ color: "#9ca3af", fontSize: "0.8125rem", marginTop: "1rem" }}>
            It only takes 30 seconds and means the world to our team.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.5rem", marginTop: "1rem" }}>
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: "0 0 0.75rem" }}>
            Need something else?
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem" }}>
            📞 Call us: {process.env.TRUST_PHONE || "(555) 123-4567"}
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
            We guarantee our work. If anything isn&apos;t right, we&apos;ll make it right — free.
          </p>
        </div>
      </main>
    </div>
  );
}
