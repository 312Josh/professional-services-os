import Link from "next/link";
import { getInvoiceStatusLabel } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { customer: true, job: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <div className="topbar" style={{ marginBottom: 0 }}>
          <div>
            <h1>Invoices</h1>
            <p className="muted">Draft/sent/paid workflow with payment link + email actions.</p>
          </div>
          <Link href="/invoices/new" className="button-link">
            Create Invoice
          </Link>
        </div>
      </section>

      <section className="card">
        <h2>Invoice Register</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Job</th>
                <th>Status</th>
                <th>Total</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                  </td>
                  <td>{invoice.customer.name}</td>
                  <td>{invoice.job?.title || "-"}</td>
                  <td>{getInvoiceStatusLabel(invoice.status)}</td>
                  <td>{formatCurrency(invoice.totalCents)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
