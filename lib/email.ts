import { formatCurrency, formatDate } from "@/lib/format";

type CustomerSnapshot = {
  name: string;
  email: string | null;
};

type InvoiceSnapshot = {
  id: string;
  invoiceNumber: string;
  totalCents: number;
  dueDate: Date | null;
  paymentLink: string | null;
};

export function buildInvoiceEmailTemplate(customer: CustomerSnapshot, invoice: InvoiceSnapshot) {
  const subject = `Invoice ${invoice.invoiceNumber} from BluePipe Plumbing`;
  const body = [
    `Hi ${customer.name},`,
    "",
    `Your invoice ${invoice.invoiceNumber} is ready.`,
    `Total due: ${formatCurrency(invoice.totalCents)}.`,
    invoice.dueDate ? `Due date: ${formatDate(invoice.dueDate)}.` : "",
    "",
    "Reply to this email if you have any questions.",
    "BluePipe Plumbing"
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, body };
}

export function buildPaymentLinkEmailTemplate(customer: CustomerSnapshot, invoice: InvoiceSnapshot) {
  const subject = `Payment link for invoice ${invoice.invoiceNumber}`;
  const body = [
    `Hi ${customer.name},`,
    "",
    `Use this secure payment link for invoice ${invoice.invoiceNumber}:`,
    invoice.paymentLink || "[Payment link has not been generated yet]",
    "",
    `Total due: ${formatCurrency(invoice.totalCents)}.`,
    "BluePipe Plumbing"
  ].join("\n");

  return { subject, body };
}

export function buildReminderEmailTemplate(customer: CustomerSnapshot, invoice: InvoiceSnapshot) {
  const subject = `Reminder: invoice ${invoice.invoiceNumber} is still open`;
  const body = [
    `Hi ${customer.name},`,
    "",
    `This is a reminder that invoice ${invoice.invoiceNumber} is still unpaid.`,
    `Outstanding amount: ${formatCurrency(invoice.totalCents)}.`,
    invoice.dueDate ? `Due date: ${formatDate(invoice.dueDate)}.` : "",
    invoice.paymentLink ? `Payment link: ${invoice.paymentLink}` : "",
    "",
    "If you already paid, please ignore this message.",
    "BluePipe Plumbing"
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, body };
}
