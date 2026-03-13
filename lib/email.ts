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
  paymentMethod?: string | null;
  paymentLink: string | null;
};

type EmailTemplateOptions = {
  paymentMethodLabel?: string;
  demoFooter?: string;
};

function appendDemoFooter(lines: string[], demoFooter: string | undefined): string {
  const bodyLines = [...lines];
  if (demoFooter) {
    bodyLines.push("", demoFooter);
  }

  return bodyLines.filter(Boolean).join("\n");
}

export function buildInvoiceEmailTemplate(
  customer: CustomerSnapshot,
  invoice: InvoiceSnapshot,
  options: EmailTemplateOptions = {}
) {
  const subject = `Invoice ${invoice.invoiceNumber} from BluePipe Plumbing`;
  const body = appendDemoFooter(
    [
      `Hi ${customer.name},`,
      "",
      `Your invoice ${invoice.invoiceNumber} is ready.`,
      `Total due: ${formatCurrency(invoice.totalCents)}.`,
      invoice.dueDate ? `Due date: ${formatDate(invoice.dueDate)}.` : "",
      "",
      "Reply to this email if you have any questions.",
      "BluePipe Plumbing"
    ],
    options.demoFooter
  );

  return { subject, body };
}

export function buildPaymentLinkEmailTemplate(
  customer: CustomerSnapshot,
  invoice: InvoiceSnapshot,
  options: EmailTemplateOptions = {}
) {
  const paymentMethodLine = options.paymentMethodLabel ? `Payment method: ${options.paymentMethodLabel}.` : "";
  const subject = `Payment link for invoice ${invoice.invoiceNumber}`;
  const body = appendDemoFooter(
    [
      `Hi ${customer.name},`,
      "",
      `Use this secure payment link for invoice ${invoice.invoiceNumber}:`,
      invoice.paymentLink || "[Payment link has not been generated yet]",
      "",
      paymentMethodLine,
      `Total due: ${formatCurrency(invoice.totalCents)}.`,
      "BluePipe Plumbing"
    ],
    options.demoFooter
  );

  return { subject, body };
}

export function buildReminderEmailTemplate(
  customer: CustomerSnapshot,
  invoice: InvoiceSnapshot,
  options: EmailTemplateOptions = {}
) {
  const paymentMethodLine = options.paymentMethodLabel ? `Preferred payment method: ${options.paymentMethodLabel}.` : "";
  const subject = `Reminder: invoice ${invoice.invoiceNumber} is still open`;
  const body = appendDemoFooter(
    [
      `Hi ${customer.name},`,
      "",
      `This is a reminder that invoice ${invoice.invoiceNumber} is still unpaid.`,
      `Outstanding amount: ${formatCurrency(invoice.totalCents)}.`,
      invoice.dueDate ? `Due date: ${formatDate(invoice.dueDate)}.` : "",
      paymentMethodLine,
      invoice.paymentLink ? `Payment link: ${invoice.paymentLink}` : "",
      "",
      "If you already paid, please ignore this message.",
      "BluePipe Plumbing"
    ],
    options.demoFooter
  );

  return { subject, body };
}
