export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { appConfig } from "@/lib/app-config";
import { formatCurrency, formatDate } from "@/lib/format";
import { getPaymentMethodLabel } from "@/lib/payments";
import { notFound } from "next/navigation";

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { customer: true, lineItems: true, job: true }
  });

  if (!invoice) {
    notFound();
  }

  const isPaid = invoice.status === "paid";
  const totalFormatted = formatCurrency(invoice.totalCents);
  const methodLabel = getPaymentMethodLabel(invoice.paymentMethod);
  const accentColor = process.env.BRAND_ACCENT_COLOR || appConfig.brand.accentColor;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`, color: "white", padding: "2rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          {process.env.BUSINESS_NAME || appConfig.brand.businessName}
        </h1>
        <p style={{ opacity: 0.8, margin: "0.25rem 0 0", fontSize: "0.875rem" }}>Invoice Payment</p>
      </header>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {isPaid ? (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#065f46", margin: "0 0 0.5rem" }}>Payment Received</h2>
            <p style={{ color: "#047857", margin: 0 }}>
              Thank you for your payment of <strong>{totalFormatted}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "0 0 0.25rem" }}>{invoice.invoiceNumber}</h2>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: "0.875rem" }}>
                    For: {invoice.customer.name}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: accentColor }}>{totalFormatted}</div>
                  <div style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 600 }}>
                    Due {formatDate(invoice.dueDate)}
                  </div>
                </div>
              </div>

              {invoice.lineItems.length > 0 && (
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "1rem" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#6b7280", margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Services</h3>
                  {invoice.lineItems.map((item: any) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.375rem 0", fontSize: "0.875rem" }}>
                      <span>{item.description}</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(item.totalCents)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "#374151", margin: "0 0 1rem", fontSize: "0.9375rem" }}>
                Pay securely via <strong>{methodLabel}</strong>
              </p>

              {invoice.paymentLink ? (
                <a
                  href={invoice.paymentLink}
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
                    textDecoration: "none"
                  }}
                >
                  Pay {totalFormatted} Now
                </a>
              ) : (
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Payment link is being generated. Please check back shortly.
                </p>
              )}

              <p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "1rem" }}>
                Questions? Call {process.env.TRUST_PHONE || "(555) 123-4567"}
              </p>
            </div>
          </>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "2rem 1.5rem", color: "#9ca3af", fontSize: "0.75rem" }}>
        © {new Date().getFullYear()} {process.env.BUSINESS_NAME || appConfig.brand.businessName}
      </footer>
    </div>
  );
}
