import { getActivityTypeLabel, getInvoiceStatusLabel, INVOICE_STATUSES, INVOICE_STATUS_LABELS } from "@/lib/constants";
import { appConfig } from "@/lib/app-config";
import { formatCurrency, formatDate } from "@/lib/format";
import { readInvoiceActionNotice } from "@/lib/invoice-action-notice";
import { getPaymentConfig, getPaymentMethodLabel, resolvePaymentMethod } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type InvoiceDetailPageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function InvoiceDetailPage({ params, searchParams }: InvoiceDetailPageProps) {
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

  const paymentConfig = getPaymentConfig();
  const notice = readInvoiceActionNotice(searchParams);
  const selectedMethod = resolvePaymentMethod(invoice.paymentMethod, paymentConfig);
  const paymentMethodLabel = getPaymentMethodLabel(invoice.paymentMethod ?? selectedMethod);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      {notice ? <p className={`notice ${notice.level}`}>{notice.message}</p> : null}

      <section className="card">
        <h1>{invoice.invoiceNumber}</h1>
        <p>
          <strong>Customer:</strong> {invoice.customer.name}
        </p>
        <p>
          <strong>Status:</strong> {getInvoiceStatusLabel(invoice.status)}
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
          <strong>Payment method:</strong> {paymentMethodLabel}
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
        <p className="muted">
          {appConfig.copy.invoicePaymentModeLabel} Primary method:{" "}
          <strong>{getPaymentMethodLabel(paymentConfig.primaryMethod)}</strong>. Enabled:
          {" "}
          {paymentConfig.enabledMethods.map((method) => method.label).join(", ")}.
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
        <p className="muted">{appConfig.copy.invoiceActionsSubtitle}</p>
        <div className="row-actions">
          <form method="post" action={`/api/invoices/${invoice.id}/status`}>
            <select name="status" defaultValue={invoice.status.toLowerCase()}>
              {INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {INVOICE_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <button type="submit" className="secondary">
              Update Status
            </button>
          </form>

          <form method="post" action={`/api/invoices/${invoice.id}/payment-link`}>
            <select name="paymentMethod" defaultValue={selectedMethod}>
              {paymentConfig.enabledMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.label}
                </option>
              ))}
            </select>
            <button type="submit">Generate Payment Link</button>
          </form>

          <form method="post" action={`/api/invoices/${invoice.id}/send-invoice`}>
            <button type="submit" className="secondary">
              Mock Send Invoice Email
            </button>
          </form>

          <form method="post" action={`/api/invoices/${invoice.id}/send-payment-link`}>
            <select name="paymentMethod" defaultValue={selectedMethod}>
              {paymentConfig.enabledMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.label}
                </option>
              ))}
            </select>
            <button type="submit" className="secondary">
              Mock Send Payment Link
            </button>
          </form>

          <form method="post" action={`/api/invoices/${invoice.id}/send-reminder`}>
            <button type="submit" className="secondary">
              Mock Send Reminder
            </button>
          </form>
        </div>
      </section>

      <section className="card">
        <h2>Notes</h2>
        <form method="post" action={`/api/invoices/${invoice.id}/notes`}>
          <textarea name="note" required placeholder="Internal note" />
          <button type="submit">Save Note</button>
        </form>
      </section>

      <section className="card">
        <h2>Recent Invoice Activity</h2>
        <ul>
          {invoice.activities.map((activity) => (
            <li key={activity.id}>
              <strong>{getActivityTypeLabel(activity.type)}:</strong> {activity.message}{" "}
              <span className="muted">({formatDate(activity.createdAt)})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
