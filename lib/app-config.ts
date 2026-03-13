function envOrDefault(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

function envIntOrDefault(name: string, fallback: number, min = 0): number {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < min) {
    return fallback;
  }

  return parsed;
}

function envChoiceOrDefault<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) {
    return fallback;
  }

  return allowed.includes(raw as T) ? (raw as T) : fallback;
}

function envCsv(name: string, fallback: string[]): string[] {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }

  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export const PAYMENT_METHOD_IDS = ["stripe", "zelle", "venmo", "paypal"] as const;
export type AppPaymentMethod = (typeof PAYMENT_METHOD_IDS)[number];
export const TRUST_LAYER_MODES = ["minimal", "defer"] as const;
export type TrustLayerMode = (typeof TRUST_LAYER_MODES)[number];

export const appConfig = {
  brand: {
    businessName: envOrDefault("BUSINESS_NAME", "Apex Field Services"),
    appTitle: envOrDefault("APP_TITLE", "Apex Field Service Ops"),
    appShortTitle: envOrDefault("APP_SHORT_TITLE", "Apex Ops"),
    appDescription: envOrDefault("APP_DESCRIPTION", "Private operations cockpit for local service businesses"),
    accentColor: envOrDefault("BRAND_ACCENT_COLOR", "#0b6a8f"),
    accentColorMuted: envOrDefault("BRAND_ACCENT_COLOR_MUTED", "#2f4758"),
    successColor: envOrDefault("BRAND_SUCCESS_COLOR", "#0c8d4f"),
    dangerColor: envOrDefault("BRAND_DANGER_COLOR", "#b13a3a"),
    surfaceTintColor: envOrDefault("BRAND_SURFACE_TINT_COLOR", "#eaf6ff")
  },
  auth: {
    sessionCookieName: envOrDefault("SESSION_COOKIE_NAME", "field_ops_admin_session"),
    demoAdminEmail: envOrDefault("DEMO_ADMIN_EMAIL", "owner@fieldops.local"),
    demoAdminPassword: envOrDefault("DEMO_ADMIN_PASSWORD", "admin123")
  },
  copy: {
    loginSubtitle: envOrDefault("LOGIN_SUBTITLE", "Owner login for your operations command center."),
    dashboardTitle: envOrDefault("DASHBOARD_TITLE", "Owner Dashboard"),
    dashboardSubtitle: envOrDefault(
      "DASHBOARD_SUBTITLE",
      "See what needs attention now, where revenue is at risk, and what to do next."
    ),
    dashboardLeadAlertTitle: envOrDefault("DASHBOARD_LEAD_ALERT_TITLE", "New lead urgency"),
    dashboardLeadAlertSubtitle: envOrDefault(
      "DASHBOARD_LEAD_ALERT_SUBTITLE",
      "Respond fast to protect conversion while buyer intent is hottest."
    ),
    dashboardFirstTouchTitle: envOrDefault("DASHBOARD_FIRST_TOUCH_TITLE", "Lead First-Touch Clock"),
    dashboardFirstTouchSubtitle: envOrDefault(
      "DASHBOARD_FIRST_TOUCH_SUBTITLE",
      "Owners should clear this queue before stale risk compounds."
    ),
    leadsTitle: envOrDefault("LEADS_TITLE", "Leads"),
    leadsSubtitle: envOrDefault(
      "LEADS_SUBTITLE",
      "Work the lead queue in priority order to stop revenue leakage."
    ),
    leadsAlertTitle: envOrDefault("LEADS_ALERT_TITLE", "Live Lead Alert"),
    leadPriorityQueueTitle: envOrDefault("LEAD_PRIORITY_QUEUE_TITLE", "Priority Queue"),
    leadPriorityQueueSubtitle: envOrDefault(
      "LEAD_PRIORITY_QUEUE_SUBTITLE",
      "Start with this list before touching anything else."
    ),
    leadIntakeTitle: envOrDefault("LEAD_INTAKE_TITLE", "Capture Request"),
    leadIntakeSubtitle: envOrDefault(
      "LEAD_INTAKE_SUBTITLE",
      "Collect enough detail to route and close the job fast."
    ),
    leadIntakeContactRequirement: envOrDefault(
      "LEAD_INTAKE_CONTACT_REQUIREMENT",
      "At least one contact method is required so this request can be worked immediately."
    ),
    leadIntakeCta: envOrDefault("LEAD_INTAKE_CTA", "Save Lead to Priority Queue"),
    leadDefaultSource: envOrDefault("LEAD_DEFAULT_SOURCE", "Inbound request"),
    leadIntakePromiseLine: envOrDefault(
      "LEAD_INTAKE_PROMISE_LINE",
      "Position this intake as a fast-response request so the customer expects immediate follow-up."
    ),
    activitySubtitle: envOrDefault(
      "ACTIVITY_SUBTITLE",
      "Audit trail of status changes, conversions, notes, and mock emails."
    ),
    invoicePaymentModeLabel: envOrDefault("INVOICE_PAYMENT_MODE_LABEL", "Demo-safe payment mode."),
    invoiceActionsSubtitle: envOrDefault(
      "INVOICE_ACTIONS_SUBTITLE",
      "Invoice and payment emails are intentionally demo/mock actions."
    ),
    emailReplyPrompt: envOrDefault("EMAIL_REPLY_PROMPT", "Reply to this email if you have any questions."),
    demoEmailFooter: envOrDefault(
      "DEMO_EMAIL_FOOTER",
      "Demo mode: email delivery and payment processing are simulated."
    ),
    trustLayerTitle: envOrDefault("TRUST_LAYER_TITLE", "Trust & authority layer"),
    trustLayerMinimalSummary: envOrDefault(
      "TRUST_LAYER_MINIMAL_SUMMARY",
      "Minimal trust layer is live now to support close conversations."
    ),
    trustLayerDeferredSummary: envOrDefault(
      "TRUST_LAYER_DEFERRED_SUMMARY",
      "Trust layer is deferred until verified proof assets are available."
    ),
    trustLayerBuildDecisionSummary: envOrDefault(
      "TRUST_LAYER_BUILD_DECISION_SUMMARY",
      "Decision: build a minimal trust layer now and use it in close conversations."
    ),
    trustLayerDeferDecisionSummary: envOrDefault(
      "TRUST_LAYER_DEFER_DECISION_SUMMARY",
      "Decision: defer trust-layer build until enough proof assets are ready."
    )
  },
  ownerOps: {
    newLeadAlertMinutes: envIntOrDefault("NEW_LEAD_ALERT_MINUTES", 20, 1),
    staleLeadHours: envIntOrDefault("STALE_LEAD_HOURS", 24, 1),
    followUpLeadHours: envIntOrDefault("FOLLOW_UP_LEAD_HOURS", 48, 1),
    defaultLeadValueCents: envIntOrDefault("DEFAULT_LEAD_VALUE_CENTS", 65000, 0)
  },
  trustLayer: {
    mode: envChoiceOrDefault("TRUST_LAYER_MODE", TRUST_LAYER_MODES, "minimal"),
    minProofPointsToBuild: envIntOrDefault("TRUST_LAYER_MIN_PROOF_POINTS", 2, 1),
    proofPoints: envCsv("TRUST_LAYER_PROOF_POINTS", [
      "Licensed and insured technicians",
      "Up-front estimates before work starts",
      "Workmanship guarantee and documented follow-through"
    ])
  },
  payments: {
    defaultEnabledMethodsCsv: envOrDefault("PAYMENT_METHODS_DEFAULT", "stripe,zelle,venmo,paypal"),
    defaultPrimaryMethod: envOrDefault("PAYMENT_PRIMARY_METHOD_DEFAULT", "stripe"),
    destinationDefaults: {
      zelleRecipient: envOrDefault("DEMO_PAYMENT_ZELLE_RECIPIENT", "ap@apexfieldservices.demo"),
      venmoHandle: envOrDefault("DEMO_PAYMENT_VENMO_HANDLE", "ApexFieldServices"),
      paypalHandle: envOrDefault("DEMO_PAYMENT_PAYPAL_HANDLE", "apexfieldservices"),
      fallbackBaseUrl: envOrDefault("DEMO_PAYMENT_FALLBACK_BASE_URL", "https://payments.apexfield.demo")
    }
  }
} as const;

export const paymentMethodCatalog: Record<
  AppPaymentMethod,
  {
    id: AppPaymentMethod;
    label: string;
    type: "integrated" | "manual";
    description: string;
    destinationLabel: string;
    demoMessage: string;
  }
> = {
  stripe: {
    id: "stripe",
    label: "Stripe",
    type: "integrated",
    description: "Card checkout with Stripe-style hosted flow",
    destinationLabel: "Stripe Checkout Session (Demo)",
    demoMessage: "Demo mode: Stripe checkout is mocked and does not create real charges."
  },
  zelle: {
    id: "zelle",
    label: "Zelle",
    type: "manual",
    description: "Bank transfer handoff via Zelle",
    destinationLabel: "Zelle Transfer Request (Demo)",
    demoMessage: "Demo mode: Zelle transfer request is mocked for demo-safe flows."
  },
  venmo: {
    id: "venmo",
    label: "Venmo",
    type: "manual",
    description: "Peer payment handoff via Venmo",
    destinationLabel: "Venmo Payment Link (Demo)",
    demoMessage: "Demo mode: Venmo handoff is mocked and no transfer is created."
  },
  paypal: {
    id: "paypal",
    label: "PayPal",
    type: "manual",
    description: "PayPal.me handoff",
    destinationLabel: "PayPal.me Request (Demo)",
    demoMessage: "Demo mode: PayPal request is mocked and no payment is captured."
  }
};
