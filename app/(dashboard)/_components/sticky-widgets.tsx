"use client";

/* ── Lead Notification Bar (top of page) ── */
export function LeadNotificationBar({ count, latestName, latestService }: {
  count: number;
  latestName?: string;
  latestService?: string;
}) {
  if (count === 0) return null;
  return (
    <div style={{
      background: "linear-gradient(90deg, #065f46 0%, #047857 100%)",
      color: "white",
      padding: "0.5rem 1rem",
      fontSize: "0.8125rem",
      fontWeight: 600,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.5rem",
    }}>
      <span>🔔 {count} new {count === 1 ? "inquiry" : "inquiries"} today</span>
      {latestName && (
        <span style={{ opacity: 0.8, fontSize: "0.75rem" }}>
          Latest: {latestName} — {latestService}
        </span>
      )}
    </div>
  );
}

/* ── Response Time Scoreboard ── */
export function ResponseTimeCard({ avg, trend, prevAvg }: {
  avg: number;
  trend: "up" | "down" | "flat";
  prevAvg: number;
}) {
  const arrow = trend === "down" ? "↓" : trend === "up" ? "↑" : "→";
  const color = trend === "down" ? "#065f46" : trend === "up" ? "#991b1b" : "#6b7280";
  const label = trend === "down" ? "Improving" : trend === "up" ? "Declining" : "Stable";

  return (
    <article className="card owner-metric" style={{ borderLeft: `4px solid ${color}` }}>
      <p className="owner-metric-label">Avg Response Time</p>
      <p className="owner-metric-value" style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        {avg} min <span style={{ fontSize: "1.25rem", color }}>⚡</span>
      </p>
      <p className="muted owner-metric-detail">
        <span style={{ color, fontWeight: 700 }}>{arrow} {label}</span> · was {prevAvg} min last week
      </p>
    </article>
  );
}

/* ── Missed Lead Counter ── */
export function MissedLeadBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div style={{
      background: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: 10,
      padding: "0.75rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    }}>
      <span style={{
        background: "#dc2626",
        color: "white",
        borderRadius: 999,
        padding: "0.25rem 0.65rem",
        fontSize: "0.8125rem",
        fontWeight: 700,
      }}>⚠️ {count}</span>
      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#991b1b" }}>
        {count === 1 ? "lead" : "leads"} waiting over 2 hours
      </span>
    </div>
  );
}

/* ── Activity Feed ── */
export function ActivityFeed({ items }: {
  items: { text: string; time: string; type: "lead" | "response" | "review" | "booking" }[];
}) {
  const icons: Record<string, string> = {
    lead: "📩",
    response: "✅",
    review: "⭐",
    booking: "📅",
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem", maxHeight: 300, overflowY: "auto" }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
          padding: "0.5rem 0.65rem",
          background: i === 0 ? "#f0f9ff" : "transparent",
          borderRadius: 8,
          borderLeft: i === 0 ? "3px solid #0284c7" : "3px solid transparent",
        }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icons[item.type] || "📌"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{item.text}</div>
            <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Competitor Comparison ── */
export function CompetitorComparison({ yours, industryHours, multiplier }: {
  yours: number;
  industryHours: number;
  multiplier: string;
}) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
      border: "1px solid #a7f3d0",
      borderRadius: 12,
      padding: "1.25rem",
      textAlign: "center",
    }}>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.8125rem", fontWeight: 600, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Speed Advantage
      </p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#065f46" }}>{yours} min</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Your response</div>
        </div>
        <div style={{ fontSize: "1.25rem", color: "#9ca3af" }}>vs</div>
        <div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#991b1b" }}>{industryHours}h</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Industry average</div>
        </div>
      </div>
      <p style={{ margin: "0.75rem 0 0", fontSize: "1.125rem", fontWeight: 700, color: "#065f46" }}>
        🚀 You&apos;re {multiplier} faster
      </p>
    </div>
  );
}

/* ── Review Notification Toast ── */
export function ReviewToast({ name, rating }: { name: string; rating: number }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "1rem 1.25rem",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      zIndex: 1000,
      animation: "slideInRight 0.4s ease-out",
      maxWidth: 320,
    }}>
      <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
        ⭐ New {rating}-star review from {name}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
        Just now
      </div>
    </div>
  );
}

/* ── Weekly Digest Summary ── */
export function WeeklyDigest({ data }: {
  data: { leadsReceived: number; avgResponse: number; bookings: number; reviews: number; revenue: number };
}) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.25rem" }}>
      <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.9375rem", fontWeight: 700 }}>📊 This Week</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.75rem", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{data.leadsReceived}</div>
          <div style={{ fontSize: "0.6875rem", color: "#6b7280" }}>Leads</div>
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{data.avgResponse}m</div>
          <div style={{ fontSize: "0.6875rem", color: "#6b7280" }}>Avg Response</div>
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{data.bookings}</div>
          <div style={{ fontSize: "0.6875rem", color: "#6b7280" }}>Bookings</div>
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{data.reviews}</div>
          <div style={{ fontSize: "0.6875rem", color: "#6b7280" }}>Reviews</div>
        </div>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>${(data.revenue / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: "0.6875rem", color: "#6b7280" }}>Revenue</div>
        </div>
      </div>
    </div>
  );
}
