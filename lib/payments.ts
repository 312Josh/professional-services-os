import { randomBytes } from "crypto";
import { appConfig, paymentMethodCatalog, type AppPaymentMethod, PAYMENT_METHOD_IDS } from "@/lib/app-config";

export type PaymentMethod = AppPaymentMethod;

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
  stripe: paymentMethodCatalog.stripe,
  zelle: paymentMethodCatalog.zelle,
  venmo: paymentMethodCatalog.venmo,
  paypal: paymentMethodCatalog.paypal
};

function normalizePaymentMethod(rawValue: string | null | undefined): PaymentMethod | null {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.trim().toLowerCase();
  return PAYMENT_METHOD_IDS.includes(normalized as PaymentMethod) ? (normalized as PaymentMethod) : null;
}

function parseEnabledPaymentMethods(rawValue: string | undefined): PaymentMethod[] {
  if (!rawValue) {
    return [...PAYMENT_METHOD_IDS];
  }

  const methods = rawValue
    .split(",")
    .map((value) => normalizePaymentMethod(value))
    .filter((value): value is PaymentMethod => Boolean(value));

  if (methods.length === 0) {
    return [...PAYMENT_METHOD_IDS];
  }

  return [...new Set(methods)];
}

export function getPaymentConfig(): PaymentConfig {
  const enabledMethodIds = parseEnabledPaymentMethods(process.env.PAYMENT_METHODS || appConfig.payments.defaultEnabledMethodsCsv);
  const requestedPrimary = normalizePaymentMethod(
    process.env.PAYMENT_PRIMARY_METHOD || appConfig.payments.defaultPrimaryMethod
  );

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
  const zelleRecipient = encodeURIComponent(appConfig.payments.destinationDefaults.zelleRecipient);
  const venmoHandle = encodeURIComponent(appConfig.payments.destinationDefaults.venmoHandle);
  const paypalHandle = encodeURIComponent(appConfig.payments.destinationDefaults.paypalHandle);
  const fallbackBaseUrl = appConfig.payments.destinationDefaults.fallbackBaseUrl.replace(/\/+$/, "");

  switch (method) {
    case "stripe":
      return {
        method,
        methodLabel,
        destinationLabel: paymentMethodCatalog.stripe.destinationLabel,
        url: `https://checkout.stripe.com/c/pay/cs_test_${token}`,
        demoMessage: paymentMethodCatalog.stripe.demoMessage
      };
    case "zelle":
      return {
        method,
        methodLabel,
        destinationLabel: paymentMethodCatalog.zelle.destinationLabel,
        url: `https://pay.zelle.com/payments?recipient=${zelleRecipient}&amount=${amount}&memo=${encodedMemo}&ref=${invoiceId}`,
        demoMessage: paymentMethodCatalog.zelle.demoMessage
      };
    case "venmo":
      return {
        method,
        methodLabel,
        destinationLabel: paymentMethodCatalog.venmo.destinationLabel,
        url: `https://venmo.com/u/${venmoHandle}?txn=pay&amount=${amount}&note=${encodedMemo}&ref=${invoiceId}`,
        demoMessage: paymentMethodCatalog.venmo.demoMessage
      };
    case "paypal":
      return {
        method,
        methodLabel,
        destinationLabel: paymentMethodCatalog.paypal.destinationLabel,
        url: `https://www.paypal.com/paypalme/${paypalHandle}/${amount}?note=${encodedMemo}`,
        demoMessage: paymentMethodCatalog.paypal.demoMessage
      };
    default:
      return {
        method,
        methodLabel,
        destinationLabel: "Payment Request (Demo)",
        url: `${fallbackBaseUrl}/pay/${invoiceId}?token=${token}`,
        demoMessage: "Demo mode: Payment request is mocked."
      };
  }
}
