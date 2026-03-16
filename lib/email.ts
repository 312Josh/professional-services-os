import { formatCurrency, formatDate } from "@/lib/format";
import { appConfig } from "@/lib/app-config";

type LeadSnapshot = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  serviceRequested: string | null;
  source: string | null;
  address: string | null;
};

export function buildNewLeadAlertEmail(lead: LeadSnapshot, demoFooter?: string) {
  const subject = `🚨 New Lead: ${lead.name} — ${lead.serviceRequested || "Service request"}`;
  const lines = [
    `New lead just came in.`,
    "",
    `Name: ${lead.name}`,
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.email ? `Email: ${lead.email}` : "",
    lead.serviceRequested ? `Service: ${lead.serviceRequested}` : "",
    lead.address ? `Address: ${lead.address}` : "",
    lead.source ? `Source: ${lead.source}` : "",
    "",
    `Respond now — speed to first contact is the #1 conversion driver.`,
    "",
    appConfig.brand.businessName,
  ].filter(Boolean);

  const body = demoFooter ? [...lines, "", demoFooter].join("\n") : lines.join("\n");
  return { subject, body };
}

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
  const subject = `Invoice ${invoice.invoiceNumber} from ${appConfig.brand.businessName}`;
  const body = appendDemoFooter(
    [
      `Hi ${customer.name},`,
      "",
      `Your invoice ${invoice.invoiceNumber} is ready.`,
      `Total due: ${formatCurrency(invoice.totalCents)}.`,
      invoice.dueDate ? `Due date: ${formatDate(invoice.dueDate)}.` : "",
      "",
      appConfig.copy.emailReplyPrompt,
      appConfig.brand.businessName
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
      appConfig.brand.businessName
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
      appConfig.brand.businessName
    ],
    options.demoFooter
  );

  return { subject, body };
}

/* ── Review request email ── */

export function buildReviewRequestEmail(input: {
  customerName: string;
  jobTitle: string;
  reviewUrl: string;
}): { subject: string; body: string } {
  const businessName = appConfig.brand.businessName;
  const subject = `How was your ${input.jobTitle} service? — ${businessName}`;

  const body = [
    `Hi ${input.customerName},`,
    "",
    `Thank you for choosing ${businessName} for your ${input.jobTitle} service.`,
    "",
    "We'd love to hear how we did. A quick review helps other homeowners find reliable service:",
    "",
    input.reviewUrl,
    "",
    "It only takes 30 seconds and means the world to our team.",
    "",
    `Thank you,`,
    businessName
  ].join("\n");

  return { subject, body };
}
