function envOrDefault(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

export const PAYMENT_METHOD_IDS = ["stripe", "zelle", "venmo", "paypal"] as const;
export type AppPaymentMethod = (typeof PAYMENT_METHOD_IDS)[number];

export const appConfig = {
  brand: {
    businessName: envOrDefault("BUSINESS_NAME", "BluePipe Plumbing"),
    appTitle: envOrDefault("APP_TITLE", "BluePipe Plumbing Ops"),
    appShortTitle: envOrDefault("APP_SHORT_TITLE", "BluePipe Ops"),
    appDescription: envOrDefault("APP_DESCRIPTION", "Private operations dashboard for plumbing business")
  },
  auth: {
    sessionCookieName: envOrDefault("SESSION_COOKIE_NAME", "plumbing_admin_session"),
    demoAdminEmail: envOrDefault("DEMO_ADMIN_EMAIL", "admin@plumbing.local"),
    demoAdminPassword: envOrDefault("DEMO_ADMIN_PASSWORD", "admin123")
  },
  copy: {
    loginSubtitle: envOrDefault("LOGIN_SUBTITLE", "Admin login for the operations dashboard."),
    dashboardTitle: envOrDefault("DASHBOARD_TITLE", "Operations Dashboard"),
    dashboardSubtitle: envOrDefault("DASHBOARD_SUBTITLE", "Private CRM + invoicing for your plumbing business."),
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
    )
  },
  payments: {
    defaultEnabledMethodsCsv: envOrDefault("PAYMENT_METHODS_DEFAULT", "stripe,zelle,venmo,paypal"),
    defaultPrimaryMethod: envOrDefault("PAYMENT_PRIMARY_METHOD_DEFAULT", "stripe"),
    destinationDefaults: {
      zelleRecipient: envOrDefault("DEMO_PAYMENT_ZELLE_RECIPIENT", "ap@bluepipeplumbing.demo"),
      venmoHandle: envOrDefault("DEMO_PAYMENT_VENMO_HANDLE", "BluePipePlumbing"),
      paypalHandle: envOrDefault("DEMO_PAYMENT_PAYPAL_HANDLE", "bluepipeplumbing"),
      fallbackBaseUrl: envOrDefault("DEMO_PAYMENT_FALLBACK_BASE_URL", "https://payments.bluepipe.demo")
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
