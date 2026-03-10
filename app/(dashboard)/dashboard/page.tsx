import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DashboardPage() {
  const [leadCount, customerCount, openJobs, openInvoices, recentInvoices, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.customer.count(),
    prisma.job.count({ where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } } }),
    prisma.invoice.count({ where: { status: { in: ["DRAFT", "SENT"] } } }),
    prisma.invoice.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Operations Dashboard</h1>
          <p className="muted">Private CRM + invoicing for your plumbing business.</p>
        </div>
      </div>

      <div className="grid three" style={{ marginBottom: "1rem" }}>
        <div className="card">
          <h3>{leadCount}</h3>
          <p className="muted">Total leads</p>
          <Link href="/leads">Manage leads</Link>
        </div>
        <div className="card">
          <h3>{customerCount}</h3>
          <p className="muted">Customers</p>
          <Link href="/customers">Manage customers</Link>
        </div>
        <div className="card">
          <h3>{openJobs}</h3>
          <p className="muted">Open jobs</p>
          <Link href="/jobs">Manage jobs</Link>
        </div>
        <div className="card">
          <h3>{openInvoices}</h3>
          <p className="muted">Open invoices</p>
          <Link href="/invoices">Manage invoices</Link>
        </div>
      </div>

      <div className="grid two">
        <section className="card">
          <h2>Recent Invoices</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td>{invoice.customer.name}</td>
                    <td>{invoice.status.toLowerCase()}</td>
                    <td>{formatCurrency(invoice.totalCents)}</td>
                    <td>{formatDate(invoice.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2>Recent Leads</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.status.toLowerCase()}</td>
                    <td>{lead.serviceRequested || "-"}</td>
                    <td>{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
