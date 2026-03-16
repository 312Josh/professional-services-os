import Link from "next/link";
import { getInvoiceStatusLabel, getJobStatusLabel } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
      activities: { where: { type: "note" }, orderBy: { createdAt: "desc" }, take: 20 }
    }
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>{customer.name}</h1>
        <p className="muted">Customer record</p>
        <p>
          <strong>Phone:</strong> {customer.phone || "-"}
        </p>
        <p>
          <strong>Email:</strong> {customer.email || "-"}
        </p>
        <p>
          <strong>Address:</strong> {customer.address || "-"}
        </p>
      </section>

      <section className="card">
        <h2>Add Note</h2>
        <form method="post" action={`/api/customers/${customer.id}/notes`} className="grid" style={{ gap: "0.75rem" }}>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            Note
            <textarea name="note" required placeholder="Customer note" />
          </label>
          <button type="submit">Save Note</button>
        </form>
      </section>

      <section className="card">
        <h2>Create Job</h2>
        <form method="post" action={`/api/customers/${customer.id}/jobs`} className="grid two">
          <label>
            Title
            <input name="title" required placeholder="Service call" />
          </label>
          <label>
            Service date
            <input name="serviceDate" type="date" />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Description
            <textarea name="description" />
          </label>
          <button type="submit">Create Job</button>
        </form>
      </section>

      <section className="card">
        <h2>Jobs</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Service Date</th>
              </tr>
            </thead>
            <tbody>
              {customer.jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{getJobStatusLabel(job.status)}</td>
                  <td>{formatDate(job.serviceDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Invoices</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {customer.invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                  </td>
                  <td>{getInvoiceStatusLabel(invoice.status)}</td>
                  <td>{formatCurrency(invoice.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Customer Nurture</h2>
        <p className="muted" style={{ marginBottom: "0.75rem" }}>Keep this customer coming back. Automated reminders fire based on last service date.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {(() => {
            const lastJob = customer.jobs[0];
            const daysSinceService = lastJob?.serviceDate
              ? Math.floor((Date.now() - new Date(lastJob.serviceDate).getTime()) / 86400000)
              : null;
            const reminders = [];

            if (daysSinceService !== null && daysSinceService > 180) {
              reminders.push({ icon: "🔧", label: "6-Month Maintenance Check", urgency: "high" });
            }
            if (daysSinceService !== null && daysSinceService > 330) {
              reminders.push({ icon: "📅", label: "Annual Service Due", urgency: "high" });
            }

            // Seasonal reminders
            const month = new Date().getMonth();
            if (month >= 8 && month <= 10) {
              reminders.push({ icon: "🍂", label: "Fall Furnace Tune-Up", urgency: "medium" });
            }
            if (month >= 2 && month <= 4) {
              reminders.push({ icon: "🌱", label: "Spring AC Check", urgency: "medium" });
            }
            if (month === 11 || month <= 1) {
              reminders.push({ icon: "❄️", label: "Winter Pipe Freeze Prevention", urgency: "medium" });
            }

            if (reminders.length === 0) {
              reminders.push({ icon: "✅", label: "No reminders due", urgency: "low" });
            }

            return reminders.map((r, i) => (
              <div key={i} style={{
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: `1px solid ${r.urgency === "high" ? "#fca5a5" : r.urgency === "medium" ? "#fde68a" : "#d1d5db"}`,
                background: r.urgency === "high" ? "#fef2f2" : r.urgency === "medium" ? "#fffbeb" : "#f9fafb",
                fontSize: "0.875rem",
                fontWeight: 600
              }}>
                {r.icon} {r.label}
              </div>
            ));
          })()}
        </div>
        {customer.jobs.length > 0 && (
          <div style={{ marginTop: "0.75rem" }}>
            <a
              href={`/review/${customer.jobs[0].id}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: 6,
                background: "#f3f4f6",
                color: "#374151",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #d1d5db"
              }}
            >
              ⭐ Send Review Request for Last Job
            </a>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Recent Notes</h2>
        <ul>
          {customer.activities.map((activity) => (
            <li key={activity.id}>
              {activity.message} <span className="muted">({formatDate(activity.createdAt)})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
