export const LEAD_STATUSES = ["new", "contacted", "converted", "disqualified"] as const;
export const JOB_STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;
export const INVOICE_STATUSES = ["draft", "sent", "paid"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  new: "new",
  contacted: "contacted",
  converted: "converted",
  disqualified: "disqualified"
};

export const JOB_STATUS_LABELS: Record<(typeof JOB_STATUSES)[number], string> = {
  scheduled: "scheduled",
  in_progress: "in progress",
  completed: "completed",
  cancelled: "cancelled"
};

export const INVOICE_STATUS_LABELS: Record<(typeof INVOICE_STATUSES)[number], string> = {
  draft: "draft",
  sent: "sent",
  paid: "paid"
};

export const DASHBOARD_OPEN_JOB_STATUSES = ["scheduled", "in_progress"] as const satisfies readonly JobStatus[];
export const DASHBOARD_OPEN_INVOICE_STATUSES = ["draft", "sent"] as const satisfies readonly InvoiceStatus[];
export const JOB_SOURCE_LEAD_STATUSES = ["new", "contacted"] as const satisfies readonly LeadStatus[];

export const ACTIVITY_TYPES = [
  "created",
  "status_change",
  "conversion",
  "note",
  "payment_link_generated",
  "email_sent"
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  created: "created",
  status_change: "status change",
  conversion: "conversion",
  note: "note",
  payment_link_generated: "payment link generated",
  email_sent: "email sent"
};

function fallbackLabel(value: string): string {
  return value.replace(/_/g, " ").toLowerCase();
}

export function getLeadStatusLabel(status: string): string {
  return LEAD_STATUS_LABELS[status as LeadStatus] ?? fallbackLabel(status);
}

export function getJobStatusLabel(status: string): string {
  return JOB_STATUS_LABELS[status as JobStatus] ?? fallbackLabel(status);
}

export function getInvoiceStatusLabel(status: string): string {
  return INVOICE_STATUS_LABELS[status as InvoiceStatus] ?? fallbackLabel(status);
}

export function getActivityTypeLabel(type: string): string {
  return ACTIVITY_TYPE_LABELS[type as ActivityType] ?? fallbackLabel(type);
}
