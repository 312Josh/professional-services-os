import {
  addInvoiceNoteAction,
  generatePaymentLinkAction,
  sendInvoiceEmailAction,
  sendPaymentLinkEmailAction,
  sendReminderEmailAction,
  updateInvoiceStatusAction
} from "@/lib/actions";
import { INVOICE_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      job: true,
      lineItems: true,
      activities: {
        where: { invoiceId: params.id },
        orderBy: { createdAt: "desc" },
        take: 30
      }
    }
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>{invoice.invoiceNumber}</h1>
        <p>
          <strong>Customer:</strong> {invoice.customer.name}
        </p>
        <p>
          <strong>Status:</strong> {invoice.status.toLowerCase()}
        </p>
        <p>
          <strong>Issue date:</strong> {formatDate(invoice.issueDate)}
        </p>
        <p>
          <strong>Due date:</strong> {formatDate(invoice.dueDate)}
        </p>
        <p>
          <strong>Related job:</strong> {invoice.job?.title || "-"}
        </p>
        <p>
          <strong>Payment link:</strong>{" "}
          {invoice.paymentLink ? (
            <a href={invoice.paymentLink} target="_blank" rel="noreferrer">
              {invoice.paymentLink}
            </a>
          ) : (
            "not generated"
          )}
        </p>
      </section>

      <section className="card">
        <h2>Line Items</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPriceCents)}</td>
                  <td>{formatCurrency(item.lineTotalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Subtotal:</strong> {formatCurrency(invoice.subtotalCents)}
        </p>
        <p>
          <strong>Tax:</strong> {formatCurrency(invoice.taxCents)}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(invoice.totalCents)}
        </p>
      </section>

      <section className="card">
        <h2>Invoice Actions</h2>
        <div className="row-actions">
          <form action={updateInvoiceStatusAction}>
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <select name="status" defaultValue={invoice.status}>
              {INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.toLowerCase()}
                </option>
              ))}
            </select>
            <button type="submit" className="secondary">
              Update Status
            </button>
          </form>

          <form action={generatePaymentLinkAction}>
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <button type="submit">Generate Payment Link</button>
          </form>

          <form action={sendInvoiceEmailAction}>
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <button type="submit" className="secondary">
              Mock Send Invoice Email
            </button>
          </form>

          <form action={sendPaymentLinkEmailAction}>
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <button type="submit" className="secondary">
              Mock Send Payment Link
            </button>
          </form>

          <form action={sendReminderEmailAction}>
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <button type="submit" className="secondary">
              Mock Send Reminder
            </button>
          </form>
        </div>
      </section>

      <section className="card">
        <h2>Notes</h2>
        <form action={addInvoiceNoteAction}>
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <textarea name="note" required placeholder="Internal note" />
          <button type="submit">Save Note</button>
        </form>
      </section>

      <section className="card">
        <h2>Recent Invoice Activity</h2>
        <ul>
          {invoice.activities.map((activity) => (
            <li key={activity.id}>
              <strong>{activity.type.toLowerCase()}:</strong> {activity.message}{" "}
              <span className="muted">({formatDate(activity.createdAt)})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
