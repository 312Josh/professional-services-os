export const LEAD_STATUSES = ["NEW", "CONTACTED", "CONVERTED", "DISQUALIFIED"] as const;
export const JOB_STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID"] as const;

export const LEAD_STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  NEW: "new",
  CONTACTED: "contacted",
  CONVERTED: "converted",
  DISQUALIFIED: "disqualified"
};

export const JOB_STATUS_LABELS: Record<(typeof JOB_STATUSES)[number], string> = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};

export const INVOICE_STATUS_LABELS: Record<(typeof INVOICE_STATUSES)[number], string> = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid"
};
