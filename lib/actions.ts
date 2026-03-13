"use server";

import { type Activity, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, createSession, requireAdmin, sanitizeRedirectPath, verifyPassword } from "@/lib/auth";
import {
  type InvoiceStatus,
  type JobStatus,
  type LeadStatus,
  getInvoiceStatusLabel,
  getJobStatusLabel,
  getLeadStatusLabel,
  INVOICE_STATUSES,
  JOB_STATUSES,
  LEAD_STATUSES
} from "@/lib/constants";
import {
  buildInvoiceEmailTemplate,
  buildPaymentLinkEmailTemplate,
  buildReminderEmailTemplate
} from "@/lib/email";
import { appConfig } from "@/lib/app-config";
import { parseCurrencyToCents } from "@/lib/format";
import { type InvoiceActionNotice } from "@/lib/invoice-action-notice";
import { buildMockPaymentDestination, getPaymentMethodLabel, resolvePaymentMethod } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

const DASHBOARD_PATHS = ["/dashboard", "/leads", "/customers", "/jobs", "/invoices", "/activity"];
const DEMO_EMAIL_FOOTER = appConfig.copy.demoEmailFooter;

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

function parseLeadStatus(rawStatus: string): LeadStatus {
  const status = rawStatus.toLowerCase();
  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    throw new Error("Invalid lead status.");
  }

  return status as LeadStatus;
}

function parseJobStatus(rawStatus: string): JobStatus {
  const status = rawStatus.toLowerCase();
  if (!JOB_STATUSES.includes(status as JobStatus)) {
    throw new Error("Invalid job status.");
  }

  return status as JobStatus;
}

function parseInvoiceStatus(rawStatus: string): InvoiceStatus {
  const status = rawStatus.toLowerCase();
  if (!INVOICE_STATUSES.includes(status as InvoiceStatus)) {
    throw new Error("Invalid invoice status.");
  }

  return status as InvoiceStatus;
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

type InvoiceWithCustomer = Prisma.InvoiceGetPayload<{
  include: { customer: true };
}>;

type MockEmailResult = {
  delivered: boolean;
  recipient: string;
  reason?: string;
};

function createNotice(level: InvoiceActionNotice["level"], message: string): InvoiceActionNotice {
  return { level, message };
}

function normalizeInvoiceStatus(status: string): InvoiceStatus {
  return INVOICE_STATUSES.includes(status as InvoiceStatus) ? (status as InvoiceStatus) : "draft";
}

async function mockSendEmail(
  invoice: InvoiceWithCustomer,
  template: {
    subject: string;
    body: string;
  }
): Promise<MockEmailResult> {
  const recipient = invoice.customer.email?.trim() || "";
  const safeSubject = `[Demo] ${template.subject}`;

  if (!recipient) {
    console.log("[MOCK EMAIL SKIPPED]", {
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      reason: "missing customer email",
      subject: safeSubject,
      body: template.body
    });

    return {
      delivered: false,
      recipient: "[missing-customer-email]",
      reason: "Customer has no email on file."
    };
  }

  // Placeholder email provider integration point (SMTP/Resend/SES later).
  console.log("[MOCK EMAIL]", {
    to: recipient,
    subject: safeSubject,
    body: template.body
  });

  return {
    delivered: true,
    recipient
  };
}

async function generateDemoPaymentLink(
  invoice: Pick<InvoiceWithCustomer, "id" | "invoiceNumber" | "totalCents" | "customerId">,
  adminId: string,
  requestedMethod: string | null | undefined,
  source: string
): Promise<{
  invoice: InvoiceWithCustomer;
  notice: InvoiceActionNotice;
}> {
  const method = resolvePaymentMethod(requestedMethod);
  const destination = buildMockPaymentDestination({
    method,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    totalCents: invoice.totalCents
  });

  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      paymentMethod: destination.method,
      paymentLink: destination.url
    },
    include: { customer: true }
  });

  await recordActivity({
    type: "payment_link_generated",
    message: `Demo payment link generated (${destination.methodLabel}) for invoice ${updatedInvoice.invoiceNumber} via ${source}`,
    admin: { connect: { id: adminId } },
    customer: { connect: { id: updatedInvoice.customerId } },
    invoice: { connect: { id: updatedInvoice.id } }
  });

  return {
    invoice: updatedInvoice,
    notice: createNotice(
      "success",
      `${destination.destinationLabel} created with ${destination.methodLabel}. ${destination.demoMessage}`
    )
  };
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = asString(formData, "email").toLowerCase();
  const password = asString(formData, "password");
  const nextPath = sanitizeRedirectPath(asString(formData, "next"));

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    const search = new URLSearchParams({ error: "Invalid credentials" });
    if (nextPath) {
      search.set("next", nextPath);
    }

    redirect(`/login?${search.toString()}`);
  }

  await createSession(admin.id);
  redirect(nextPath || "/dashboard");
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

  const phone = optionalString(formData, "phone");
  const email = optionalString(formData, "email");
  if (!phone && !email) {
    throw new Error("A phone or email is required to work this lead.");
  }

  const serviceRequested = optionalString(formData, "serviceRequested");
  if (!serviceRequested) {
    throw new Error("Service requested is required.");
  }

  const preferredContactMethod = optionalString(formData, "preferredContactMethod");
  const requestUrgency = optionalString(formData, "requestUrgency");
  const intakeNote = asString(formData, "intakeNote");

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      address: optionalString(formData, "address"),
      source: optionalString(formData, "source") || appConfig.copy.leadDefaultSource,
      serviceRequested,
      status: "new"
    }
  });

  await recordActivity({
    type: "created",
    message: `Lead created: ${lead.name}`,
    admin: { connect: { id: admin.id } },
    lead: { connect: { id: lead.id } }
  });

  const intakeDetails: string[] = [];
  if (requestUrgency) {
    intakeDetails.push(`Urgency: ${requestUrgency}`);
  }
  if (preferredContactMethod) {
    intakeDetails.push(`Preferred contact: ${preferredContactMethod}`);
  }
  if (intakeNote) {
    intakeDetails.push(`Note: ${intakeNote}`);
  }

  if (intakeDetails.length > 0) {
    await recordActivity({
      type: "note",
      message: `Intake details: ${intakeDetails.join(" | ")}`,
      admin: { connect: { id: admin.id } },
      lead: { connect: { id: lead.id } }
    });
  }

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
    message: `Lead ${lead.name} status changed to ${getLeadStatusLabel(status)}`,
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
    message: `Job ${job.title} status changed to ${getJobStatusLabel(status)}`,
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

  const status = parseInvoiceStatus(asString(formData, "status") || "draft");
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
    message: `Invoice ${invoice.invoiceNumber} status changed to ${getInvoiceStatusLabel(status)}`,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function generatePaymentLinkAction(formData: FormData): Promise<InvoiceActionNotice> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");
  const requestedMethod = asString(formData, "paymentMethod");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    return createNotice("error", "Invoice not found. Demo payment link was not generated.");
  }

  const result = await generateDemoPaymentLink(invoice, admin.id, requestedMethod, "invoice action");

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);
  return result.notice;
}

export async function sendInvoiceEmailAction(formData: FormData): Promise<InvoiceActionNotice> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    return createNotice("error", "Invoice not found. Demo invoice email was not sent.");
  }

  const template = buildInvoiceEmailTemplate(invoice.customer, invoice, {
    demoFooter: DEMO_EMAIL_FOOTER
  });
  const emailResult = await mockSendEmail(invoice, template);
  const currentStatus = normalizeInvoiceStatus(invoice.status);

  const updated = await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: currentStatus === "draft" ? "sent" : currentStatus
    }
  });

  const activityMessage = emailResult.delivered
    ? `Demo invoice email sent to ${emailResult.recipient}: ${template.subject}`
    : `Demo invoice email skipped: ${emailResult.reason}`;

  await recordActivity({
    type: "email_sent",
    message: activityMessage,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: updated.customerId } },
    invoice: { connect: { id: updated.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);

  if (emailResult.delivered) {
    return createNotice("success", `Demo invoice email sent to ${emailResult.recipient}. No real email was sent.`);
  }

  return createNotice("warning", `Demo invoice email skipped: ${emailResult.reason}`);
}

export async function sendPaymentLinkEmailAction(formData: FormData): Promise<InvoiceActionNotice> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");
  const requestedMethod = asString(formData, "paymentMethod");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    return createNotice("error", "Invoice not found. Demo payment-link email was not sent.");
  }

  let workingInvoice = invoice;
  let linkFallbackMessage = "";
  if (!workingInvoice.paymentLink) {
    const linkResult = await generateDemoPaymentLink(workingInvoice, admin.id, requestedMethod, "payment-link email fallback");
    workingInvoice = linkResult.invoice;
    linkFallbackMessage = " A demo payment link was generated automatically.";
  }

  const paymentMethodLabel = getPaymentMethodLabel(workingInvoice.paymentMethod);
  const template = buildPaymentLinkEmailTemplate(workingInvoice.customer, workingInvoice, {
    paymentMethodLabel,
    demoFooter: DEMO_EMAIL_FOOTER
  });
  const emailResult = await mockSendEmail(workingInvoice, template);

  const activityMessage = emailResult.delivered
    ? `Demo payment-link email sent via ${paymentMethodLabel} to ${emailResult.recipient}: ${template.subject}`
    : `Demo payment-link email skipped: ${emailResult.reason}`;

  await recordActivity({
    type: "email_sent",
    message: activityMessage,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: workingInvoice.customerId } },
    invoice: { connect: { id: workingInvoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);

  if (emailResult.delivered) {
    return createNotice(
      "success",
      `Demo payment-link email sent to ${emailResult.recipient} using ${paymentMethodLabel}.${linkFallbackMessage}`
    );
  }

  return createNotice("warning", `Demo payment-link email skipped: ${emailResult.reason}.${linkFallbackMessage}`);
}

export async function sendReminderEmailAction(formData: FormData): Promise<InvoiceActionNotice> {
  const admin = await requireAdmin();
  const invoiceId = asString(formData, "invoiceId");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true }
  });

  if (!invoice) {
    return createNotice("error", "Invoice not found. Demo reminder email was not sent.");
  }

  const paymentMethodLabel = invoice.paymentMethod ? getPaymentMethodLabel(invoice.paymentMethod) : undefined;
  const template = buildReminderEmailTemplate(invoice.customer, invoice, {
    paymentMethodLabel,
    demoFooter: DEMO_EMAIL_FOOTER
  });
  const emailResult = await mockSendEmail(invoice, template);

  const activityMessage = emailResult.delivered
    ? `Demo reminder email sent to ${emailResult.recipient}: ${template.subject}`
    : `Demo reminder email skipped: ${emailResult.reason}`;

  await recordActivity({
    type: "email_sent",
    message: activityMessage,
    admin: { connect: { id: admin.id } },
    customer: { connect: { id: invoice.customerId } },
    invoice: { connect: { id: invoice.id } }
  });

  revalidateDashboardPaths();
  revalidatePath(`/invoices/${invoiceId}`);

  if (emailResult.delivered) {
    return createNotice("success", `Demo reminder email sent to ${emailResult.recipient}. No real email was sent.`);
  }

  return createNotice("warning", `Demo reminder email skipped: ${emailResult.reason}`);
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
