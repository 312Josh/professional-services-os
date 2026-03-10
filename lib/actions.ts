"use server";

import { randomBytes } from "crypto";
import { type Activity, type Invoice, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, createSession, requireAdmin, verifyPassword } from "@/lib/auth";
import { INVOICE_STATUSES, JOB_STATUSES, LEAD_STATUSES } from "@/lib/constants";
import {
  buildInvoiceEmailTemplate,
  buildPaymentLinkEmailTemplate,
  buildReminderEmailTemplate
} from "@/lib/email";
import { parseCurrencyToCents } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const DASHBOARD_PATHS = ["/dashboard", "/leads", "/customers", "/jobs", "/invoices", "/activity"];

function asString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(formData: FormData, key: string): string | null {
  const value = asString(formData, key);
  return value || null;
}

function parseOptionalDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function revalidateDashboardPaths(): void {
  for (const path of DASHBOARD_PATHS) {
    revalidatePath(path);
  }
}

async function recordActivity(input: Prisma.ActivityCreateInput): Promise<Activity> {
  return prisma.activity.create({ data: input });
}

function parseLeadStatus(rawStatus: string): string {
  if (!LEAD_STATUSES.includes(rawStatus as (typeof LEAD_STATUSES)[number])) {
    throw new Error("Invalid lead status.");
  }

  return rawStatus;
}

function parseJobStatus(rawStatus: string): string {
  if (!JOB_STATUSES.includes(rawStatus as (typeof JOB_STATUSES)[number])) {
    throw new Error("Invalid job status.");
  }

  return rawStatus;
}

function parseInvoiceStatus(rawStatus: string): string {
  if (!INVOICE_STATUSES.includes(rawStatus as (typeof INVOICE_STATUSES)[number])) {
    throw new Error("Invalid invoice status.");
  }

  return rawStatus;
}

function parseLineItems(raw: string) {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("At least one line item is required.");
  }

  return lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 3) {
      throw new Error(`Line ${index + 1} must be: description|quantity|unit price`);
    }

    const [description, quantityRaw, unitPriceRaw] = parts;
    const quantity = Number.parseInt(quantityRaw, 10);

    if (!description) {
      throw new Error(`Line ${index + 1} description is required.`);
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Line ${index + 1} quantity must be a positive integer.`);
    }

    const unitPriceCents = parseCurrencyToCents(unitPriceRaw);
    if (unitPriceCents < 0) {
      throw new Error(`Line ${index + 1} unit price cannot be negative.`);
    }

    return {
      description,
      quantity,
      unitPriceCents,
      lineTotalCents: quantity * unitPriceCents
    };
  });
}

async function nextInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(count + 1).padStart(4, "0");
  return `INV-${datePart}-${serial}`;
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = asString(formData, "email").toLowerCase();
  const password = asString(formData, "password");

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
  }

  await createSession(admin.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

export async function createLeadAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const name = asString(formData, "name");
  if (!name) {
    throw new Error("Lead name is required.");
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      email: optionalString(formData, "email"),
      phone: optionalString(formData, "phone"),
      address: optionalString(formData, "address"),
      source: optionalString(formData, "source"),
      serviceRequested: optionalString(formData, "serviceRequested"),
      status: "new"
    }
  });

  await recordActivity({
    type: "created",
    message: `Lead created: ${lead.name}`,
    admin: { connect: { id: admin.id } },
    lead: { connect: { id: lead.id } }
  });

  revalidateDashboardPaths();
}

export async function updateLeadStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const leadId = asString(formData, "leadId");
  const status = parseLeadStatus(asString(formData, "status"));
  const disqualifyReason = optionalString(formData, "disqualifyReason");

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status,
      disqualifyReason: status === "disqualified" ? disqualifyReason : null
    }
  });

  await recordActivity({
    type: "status_change",
    message: `Lead ${lead.name} status changed to ${status.toLowerCase()}`,
    admin: { connect: { id: admin.id } },
    lead: { connect: { id: lead.id } }
  });

  revalidateDashboardPaths();
}

export async function convertLeadToCustomerAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const leadId = asString(formData, "leadId");

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new Error("Lead not found.");
  }

  if (lead.convertedCustomerId) {
    revalidateDashboardPaths();
    return;
  }

  const customer = await prisma.customer.create({
    data: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address
    }
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: "converted",
      convertedCustomerId: customer.id
    }
  });

  await recordActivity({
    type: "conversion",
    message: `Lead converted to customer: ${customer.name}`,
    admin: { connect: { id: admin.id } },
    lead: { connect: { id: lead.id } },
    customer: { connect: { id: customer.id } }
  });

  revalidateDashboardPaths();
}

export async function addLeadNoteAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const leadId = asString(formData, "leadId");
  const note = asString(formData, "note");

  if (!note) {
    throw new Error("Note cannot be empty.");
  }

  await recordActivity({
    type: "note",
    message: note,
    admin: { connect: { id: admin.id } },
    lead: { connect: { id: leadId } }
  });

  revalidateDashboardPaths();
}

export async function createCustomerAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const name = asString(formData, "name");

  if (!name) {
    throw new Error("Customer name is required.");
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      email: optionalString(formData, "email"),
      phone: optionalString(formData, "phone"),
      address: optionalString(formData, "address")
    }
  });

  await recordActivity({
    type: "created",
    message: `Customer created: ${customer.name}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: customer.id } }
  });

  revalidateDashboardPaths();
}

export async function addCustomerNoteAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const customerId = asString(formData, "customerId");
  const note = asString(formData, "note");

  if (!note) {
    throw new Error("Note cannot be empty.");
  }

  await recordActivity({
    type: "note",
    message: note,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: customerId } }
  });

  revalidateDashboardPaths();
}

export async function createJobAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const title = asString(formData, "title");
  const customerId = asString(formData, "customerId");

  if (!title || !customerId) {
    throw new Error("Title and customer are required for a job.");
  }

  const job = await prisma.job.create({
    data: {
      title,
      description: optionalString(formData, "description"),
      customerId,
      leadId: optionalString(formData, "leadId"),
      serviceDate: parseOptionalDate(asString(formData, "serviceDate")),
      status: "scheduled"
    }
  });

  await recordActivity({
    type: "created",
    message: `Job created: ${job.title}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: customerId } },
    job: { connect: { id: job.id } }
  });

  revalidateDashboardPaths();
}

export async function updateJobStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const jobId = asString(formData, "jobId");
  const status = parseJobStatus(asString(formData, "status"));

  const job = await prisma.job.update({
    where: { id: jobId },
    data: { status }
  });

  await recordActivity({
    type: "status_change",
    message: `Job ${job.title} status changed to ${status.toLowerCase()}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: job.customerId } },
    job: { connect: { id: job.id } }
  });

  revalidateDashboardPaths();
}

export async function addJobNoteAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const jobId = asString(formData, "jobId");
  const customerId = asString(formData, "customerId");
  const note = asString(formData, "note");

  if (!note) {
    throw new Error("Note cannot be empty.");
  }

  await recordActivity({
    type: "note",
    message: note,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: customerId } },
    job: { connect: { id: jobId } }
  });

  revalidateDashboardPaths();
}

export async function createInvoiceAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const customerId = asString(formData, "customerId");
  if (!customerId) {
    throw new Error("Customer is required.");
  }

  const lineItems = parseLineItems(asString(formData, "lineItems"));
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const taxRatePercent = Number.parseFloat(asString(formData, "taxRatePercent") || "0");
  const safeTaxRate = Number.isFinite(taxRatePercent) ? Math.max(taxRatePercent, 0) : 0;
  const taxCents = Math.round(subtotalCents * (safeTaxRate / 100));
  const totalCents = subtotalCents + taxCents;

  const status = parseInvoiceStatus(asString(formData, "status") || "DRAFT");
  const invoiceNumber = await nextInvoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId,
      jobId: optionalString(formData, "jobId"),
      issueDate: parseOptionalDate(asString(formData, "issueDate")) || new Date(),
      dueDate: parseOptionalDate(asString(formData, "dueDate")),
      status,
      notes: optionalString(formData, "notes"),
      subtotalCents,
      taxCents,
      totalCents,
      lineItems: {
        create: lineItems
      }
    }
  });

  await recordActivity({
    type: "created",
    message: `Invoice created: ${invoice.invoiceNumber}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  redirect(`/invoices/${invoice.id}`);
}

export async function updateInvoiceStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");
  const status = parseInvoiceStatus(asString(formData, "status"));

  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status }
  });

  await recordActivity({
    type: "status_change",
    message: `Invoice ${invoice.invoiceNumber} status changed to ${status.toLowerCase()}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function generatePaymentLinkAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");

  const token = randomBytes(12).toString("hex");
  const paymentLink = `https://payments.placeholder.local/pay/${invoiceId}?token=${token}`;

  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { paymentLink }
  });

  await recordActivity({
    type: "payment_link_generated",
    message: `Payment link generated for invoice ${invoice.invoiceNumber}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}

async function mockSendEmail(invoice: Invoice & { customer: { name: string; email: string | null } }, template: {
  subject: string;
  body: string;
}) {
  // Placeholder email provider integration point (SMTP/Resend/SES/Stripe receipts later).
  console.log("[MOCK EMAIL]", {
    to: invoice.customer.email,
    subject: template.subject,
    body: template.body
  });
}

export async function sendInvoiceEmailAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const template = buildInvoiceEmailTemplate(invoice.customer, invoice);
  await mockSendEmail(invoice, template);

  const updated = await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: invoice.status === "draft" ? "sent" : invoice.status
    }
  });

  await recordActivity({
    type: "email_sent",
    message: `Invoice email mock-sent: ${template.subject}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: updated.customerId } },
    invoice: { connect: { id: updated.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function sendPaymentLinkEmailAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const template = buildPaymentLinkEmailTemplate(invoice.customer, invoice);
  await mockSendEmail(invoice, template);

  await recordActivity({
    type: "email_sent",
    message: `Payment link email mock-sent: ${template.subject}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function sendReminderEmailAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const template = buildReminderEmailTemplate(invoice.customer, invoice);
  await mockSendEmail(invoice, template);

  await recordActivity({
    type: "email_sent",
    message: `Reminder email mock-sent: ${template.subject}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function addInvoiceNoteAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");
  const note = asString(formData, "note");

  if (!note) {
    throw new Error("Note cannot be empty.");
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  await recordActivity({
    type: "note",
    message: note,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}
