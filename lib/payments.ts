import { randomBytes } from "crypto";

const SUPPORTED_PAYMENT_METHODS = ["stripe", "zelle", "venmo", "paypal"] as const;

export type PaymentMethod = (typeof SUPPORTED_PAYMENT_METHODS)[number];

export type PaymentMethodConfig = {
  id: PaymentMethod;
  label: string;
  type: "integrated" | "manual";
  description: string;
};

export type PaymentConfig = {
  primaryMethod: PaymentMethod;
  enabledMethods: PaymentMethodConfig[];
};

export type MockPaymentDestination = {
  method: PaymentMethod;
  methodLabel: string;
  destinationLabel: string;
  url: string;
  demoMessage: string;
};

const PAYMENT_METHODS: Record<PaymentMethod, PaymentMethodConfig> = {
  stripe: {
    id: "stripe",
    label: "Stripe",
    type: "integrated",
    description: "Card checkout with Stripe-style hosted flow"
  },
  zelle: {
    id: "zelle",
    label: "Zelle",
    type: "manual",
    description: "Bank transfer handoff via Zelle"
  },
  venmo: {
    id: "venmo",
    label: "Venmo",
    type: "manual",
    description: "Peer payment handoff via Venmo"
  },
  paypal: {
    id: "paypal",
    label: "PayPal",
    type: "manual",
    description: "PayPal.me handoff"
  }
};

function normalizePaymentMethod(rawValue: string | null | undefined): PaymentMethod | null {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.trim().toLowerCase();
  return SUPPORTED_PAYMENT_METHODS.includes(normalized as PaymentMethod) ? (normalized as PaymentMethod) : null;
}

function parseEnabledPaymentMethods(rawValue: string | undefined): PaymentMethod[] {
  if (!rawValue) {
    return [...SUPPORTED_PAYMENT_METHODS];
  }

  const methods = rawValue
    .split(",")
    .map((value) => normalizePaymentMethod(value))
    .filter((value): value is PaymentMethod => Boolean(value));

  if (methods.length === 0) {
    return [...SUPPORTED_PAYMENT_METHODS];
  }

  return [...new Set(methods)];
}

export function getPaymentConfig(): PaymentConfig {
  const enabledMethodIds = parseEnabledPaymentMethods(process.env.PAYMENT_METHODS);
  const requestedPrimary = normalizePaymentMethod(process.env.PAYMENT_PRIMARY_METHOD);

  const primaryMethod =
    requestedPrimary && enabledMethodIds.includes(requestedPrimary)
      ? requestedPrimary
      : enabledMethodIds.includes("stripe")
        ? "stripe"
        : enabledMethodIds[0];

  return {
    primaryMethod,
    enabledMethods: enabledMethodIds.map((id) => PAYMENT_METHODS[id])
  };
}

export function resolvePaymentMethod(requestedMethod: string | null | undefined, config?: PaymentConfig): PaymentMethod {
  const safeConfig = config ?? getPaymentConfig();
  const normalized = normalizePaymentMethod(requestedMethod);

  if (normalized && safeConfig.enabledMethods.some((method) => method.id === normalized)) {
    return normalized;
  }

  return safeConfig.primaryMethod;
}

export function getPaymentMethodLabel(method: string | null | undefined): string {
  const normalized = normalizePaymentMethod(method);
  if (!normalized) {
    return "Unspecified";
  }

  return PAYMENT_METHODS[normalized].label;
}

function formatDollars(totalCents: number): string {
  return (Math.max(totalCents, 0) / 100).toFixed(2);
}

export function buildMockPaymentDestination(input: {
  method: PaymentMethod;
  invoiceId: string;
  invoiceNumber: string;
  totalCents: number;
}): MockPaymentDestination {
  const { method, invoiceId, invoiceNumber, totalCents } = input;
  const methodLabel = PAYMENT_METHODS[method].label;
  const token = randomBytes(10).toString("hex");
  const amount = formatDollars(totalCents);
  const encodedMemo = encodeURIComponent(`Invoice ${invoiceNumber}`);

  switch (method) {
    case "stripe":
      return {
        method,
        methodLabel,
        destinationLabel: "Stripe Checkout Session (Demo)",
        url: `https://checkout.stripe.com/c/pay/cs_test_${token}`,
        demoMessage: "Demo mode: Stripe checkout is mocked and does not create real charges."
      };
    case "zelle":
      return {
        method,
        methodLabel,
        destinationLabel: "Zelle Transfer Request (Demo)",
        url: `https://pay.zelle.com/payments?recipient=ap%40bluepipeplumbing.demo&amount=${amount}&memo=${encodedMemo}&ref=${invoiceId}`,
        demoMessage: "Demo mode: Zelle transfer request is mocked for demo-safe flows."
      };
    case "venmo":
      return {
        method,
        methodLabel,
        destinationLabel: "Venmo Payment Link (Demo)",
        url: `https://venmo.com/u/BluePipePlumbing?txn=pay&amount=${amount}&note=${encodedMemo}&ref=${invoiceId}`,
        demoMessage: "Demo mode: Venmo handoff is mocked and no transfer is created."
      };
    case "paypal":
      return {
        method,
        methodLabel,
        destinationLabel: "PayPal.me Request (Demo)",
        url: `https://www.paypal.com/paypalme/bluepipeplumbing/${amount}?note=${encodedMemo}`,
        demoMessage: "Demo mode: PayPal request is mocked and no payment is captured."
      };
    default:
      return {
        method,
        methodLabel,
        destinationLabel: "Payment Request (Demo)",
        url: `https://payments.bluepipe.demo/pay/${invoiceId}?token=${token}`,
        demoMessage: "Demo mode: Payment request is mocked."
      };
  }
}
