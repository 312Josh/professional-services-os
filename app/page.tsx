import Link from "next/link";
import { getTrustConfig } from "@/lib/trust-config";

export default function HomePage() {
  const trust = getTrustConfig();

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#1a1a2e" }}>
      {/* Hero */}
      <header style={{ background: "linear-gradient(135deg, #0b6a8f 0%, #064a63 100%)", color: "white", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.2 }}>{trust.companyName}</h1>
        <p style={{ fontSize: "1.25rem", opacity: 0.9, margin: "0 0 1rem" }}>{trust.tagline}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600 }}>
            ⚡ {trust.responseTimeMinutes}-Minute Response
          </span>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600 }}>
            🛡️ Licensed & Insured
          </span>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600 }}>
            📍 {trust.serviceArea}
          </span>
        </div>
        <a href={`tel:${trust.phone}`} style={{ display: "inline-block", background: "#FF4C00", color: "white", padding: "1rem 2.5rem", borderRadius: "999px", fontSize: "1.125rem", fontWeight: 700, textDecoration: "none", marginTop: "0.5rem" }}>
          📞 Call Now: {trust.phone}
        </a>
        <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", opacity: 0.7 }}>{trust.yearsInBusiness}+ years serving {trust.serviceArea}</p>
      </header>

      {/* Trust Badges */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Why Customers Choose Us</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
          {trust.badges.map((badge) => (
            <div key={badge.label} style={{ textAlign: "center", padding: "1.25rem 0.75rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #e5e7eb" }}>
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
            {trust.services.map((service) => (
              <div key={service} style={{ background: "white", padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #e5e7eb", fontWeight: 600, fontSize: "0.9375rem" }}>
                ✓ {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>What Our Customers Say</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "1.5rem" }}>
          {"⭐".repeat(5)} {(trust.reviews.reduce((s, r) => s + r.rating, 0) / trust.reviews.length).toFixed(1)} average from {trust.reviews.length} reviews
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {trust.reviews.map((review, i) => (
            <div key={i} style={{ background: "white", padding: "1.5rem", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <div style={{ marginBottom: "0.5rem" }}>{"⭐".repeat(review.rating)}</div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#374151", margin: "0 0 0.75rem" }}>"{review.text}"</p>
              <div style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
                <strong>{review.name}</strong> · {review.service} · {review.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #0b6a8f 0%, #064a63 100%)", color: "white", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>Need Service? We Respond in {trust.responseTimeMinutes} Minutes.</h2>
        <p style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "1.5rem" }}>Call now or request service online. Free estimates.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <a href={`tel:${trust.phone}`} style={{ display: "inline-block", background: "#FF4C00", color: "white", padding: "0.875rem 2rem", borderRadius: "999px", fontSize: "1rem", fontWeight: 700, textDecoration: "none" }}>
            📞 {trust.phone}
          </a>
          <Link href="/login" style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "white", padding: "0.875rem 2rem", borderRadius: "999px", fontSize: "1rem", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
            Owner Login →
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      {trust.faq.length > 0 && (
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {trust.faq.map((item, i) => (
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

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "1.5rem", color: "#9ca3af", fontSize: "0.8125rem" }}>
        © {new Date().getFullYear()} {trust.companyName}. Serving {trust.serviceArea}. Licensed & Insured.
      </footer>
    </div>
  );
}
