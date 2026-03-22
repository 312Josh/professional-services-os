export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildSeoMetadata, buildJsonLd, buildFaqJsonLd, buildReviewJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const proof = await prisma.proofAsset.findUnique({ where: { slug: params.slug } });
  if (!proof) return {};
  const config: ProofConfig = JSON.parse(proof.config);
  const pageUrl = proof.pageUrl || `https://plumbing-os.vercel.app/proof/${params.slug}`;
  return buildSeoMetadata({
    companyName: config.brand.companyName,
    tagline: config.brand.tagline,
    phone: config.brand.phone,
    serviceArea: config.brand.serviceArea,
    yearsInBusiness: config.brand.yearsInBusiness,
    responseTimeMinutes: config.operations.responseTimeMinutes,
    services: config.services,
    reviews: config.reviews,
  }, pageUrl);
}

type ProofConfig = {
  brand: {
    companyName: string;
    tagline: string;
    phone: string;
    serviceArea: string;
    yearsInBusiness: number;
    accentColor: string;
    website: string;
  };
  services: string[];
  trustBadges: { label: string; icon: string }[];
  reviews: { name: string; service: string; text: string; rating: number; date: string }[];
  painPoints: string[];
  faq?: { question: string; answer: string }[];
  rep: { name: string; bookingLink: string };
  operations: { responseTimeMinutes: number };
};

export default async function ProofPage({ params }: { params: { slug: string } }) {
  const proof = await prisma.proofAsset.findUnique({ where: { slug: params.slug } });
  if (!proof) notFound();

  const config: ProofConfig = JSON.parse(proof.config);
  const { brand, services, trustBadges, reviews, painPoints, faq, rep, operations } = config;
  const stars = (n: number) => "⭐".repeat(n);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const jsonLd = buildJsonLd({
    companyName: brand.companyName,
    tagline: brand.tagline,
    phone: brand.phone,
    serviceArea: brand.serviceArea,
    yearsInBusiness: brand.yearsInBusiness,
    responseTimeMinutes: operations.responseTimeMinutes,
    services,
    reviews,
    url: proof.pageUrl || undefined,
  });

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#1a1a2e" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faq && faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faq)) }} />}
      {reviews.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildReviewJsonLd(reviews, brand.companyName)) }} />}
      {/* Hero */}
      <header style={{ background: `linear-gradient(135deg, ${brand.accentColor} 0%, ${brand.accentColor}cc 100%)`, color: "white", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.2 }}>{brand.companyName}</h1>
        <p style={{ fontSize: "1.25rem", opacity: 0.9, margin: "0 0 1rem" }}>{brand.tagline}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.5rem 1rem", borderRadius: 999, fontSize: "0.875rem", fontWeight: 600 }}>⚡ {operations.responseTimeMinutes}-Minute Response</span>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.5rem 1rem", borderRadius: 999, fontSize: "0.875rem", fontWeight: 600 }}>🛡️ Licensed & Insured</span>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.5rem 1rem", borderRadius: 999, fontSize: "0.875rem", fontWeight: 600 }}>📍 {brand.serviceArea}</span>
        </div>
        <a href={`tel:${brand.phone}`} style={{ display: "inline-block", background: "#FF4C00", color: "white", padding: "1rem 2.5rem", borderRadius: 999, fontSize: "1.125rem", fontWeight: 700, textDecoration: "none", marginTop: "0.5rem" }}>
          📞 Call Now: {brand.phone}
        </a>
        <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", opacity: 0.7 }}>{brand.yearsInBusiness}+ years serving {brand.serviceArea}</p>
      </header>

      {/* Pain Points (if provided) */}
      {painPoints.length > 0 && (
        <section style={{ background: "#fef2f2", padding: "2rem 1.5rem", borderBottom: "2px solid #fca5a5" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: 700, color: "#991b1b", marginBottom: "1rem" }}>
              🚨 Issues We Found
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem" }}>
              {painPoints.map((point, i) => (
                <div key={i} style={{ background: "white", padding: "1rem", borderRadius: 10, border: "1px solid #fca5a5", fontSize: "0.9375rem", fontWeight: 600, color: "#991b1b" }}>
                  ❌ {point}
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", color: "#7f1d1d", marginTop: "1rem", fontSize: "0.875rem" }}>
              These gaps cost you leads every day. We can fix all of them.
            </p>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Why Customers Choose {brand.companyName}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
          {trustBadges.map((badge, i) => (
            <div key={i} style={{ textAlign: "center", padding: "1.25rem 0.75rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{badge.icon}</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>{badge.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ background: "#f8fafc", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Our Services</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {services.map((svc, i) => (
              <div key={i} style={{ background: "white", padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #e5e7eb", fontWeight: 600, fontSize: "0.9375rem" }}>✓ {svc}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>What Our Customers Say</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "1.5rem" }}>⭐⭐⭐⭐⭐ {avgRating} average from {reviews.length} reviews</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ background: "white", padding: "1.5rem", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <div style={{ marginBottom: "0.5rem" }}>{stars(review.rating)}</div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#374151", margin: "0 0 0.75rem" }}>&quot;{review.text}&quot;</p>
              <div style={{ fontSize: "0.8125rem", color: "#6b7280" }}><strong>{review.name}</strong> · {review.service} · {review.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${brand.accentColor} 0%, ${brand.accentColor}cc 100%)`, color: "white", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>Need Service? We Respond in {operations.responseTimeMinutes} Minutes.</h2>
        <p style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "1.5rem" }}>Call now or request service online. Free estimates.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <a href={`tel:${brand.phone}`} style={{ display: "inline-block", background: "#FF4C00", color: "white", padding: "0.875rem 2rem", borderRadius: 999, fontSize: "1rem", fontWeight: 700, textDecoration: "none" }}>📞 {brand.phone}</a>
          {rep.bookingLink && (
            <a href={rep.bookingLink} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "white", padding: "0.875rem 2rem", borderRadius: 999, fontSize: "1rem", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
              📅 Book with {rep.name || "Us"}
            </a>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {faq && faq.length > 0 && (
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {faq.map((item: any, i: number) => (
              <details key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <summary style={{ padding: "1rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9375rem", color: "#1a1a2e" }}>
                  {item.question}
                </summary>
                <div style={{ padding: "0 1.25rem 1rem", color: "#4b5563", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Rep Attribution */}
      {rep.name && (
        <div style={{ textAlign: "center", padding: "1.5rem", background: "#f0f9ff", borderTop: "1px solid #bae6fd" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#0369a1" }}>
            <strong>{brand.companyName}</strong> preview
          </p>
          {rep.bookingLink && (
            <a href={rep.bookingLink} style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.875rem", color: "#0369a1", fontWeight: 600 }}>
              Schedule a call to discuss →
            </a>
          )}
        </div>
      )}

      <footer style={{ textAlign: "center", padding: "1.5rem", color: "#9ca3af", fontSize: "0.8125rem" }}>
        © {new Date().getFullYear()} {brand.companyName}. Serving {brand.serviceArea}. Licensed & Insured.
      </footer>
    </div>
  );
}
