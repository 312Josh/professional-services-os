export type InvoiceActionNoticeLevel = "success" | "warning" | "error";

export type InvoiceActionNotice = {
  level: InvoiceActionNoticeLevel;
  message: string;
};

type SearchParamsLike = {
  [key: string]: string | string[] | undefined;
};

const NOTICE_KEY = "invoiceNotice";
const NOTICE_LEVEL_KEY = "invoiceNoticeLevel";

function asSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function setInvoiceActionNotice(url: URL, notice: InvoiceActionNotice): void {
  url.searchParams.set(NOTICE_KEY, notice.message);
  url.searchParams.set(NOTICE_LEVEL_KEY, notice.level);
}

export function readInvoiceActionNotice(searchParams: SearchParamsLike | undefined): InvoiceActionNotice | null {
  if (!searchParams) {
    return null;
  }

  const message = asSingleValue(searchParams[NOTICE_KEY]).trim();
  if (!message) {
    return null;
  }

  const rawLevel = asSingleValue(searchParams[NOTICE_LEVEL_KEY]).toLowerCase();
  const level: InvoiceActionNoticeLevel = rawLevel === "warning" || rawLevel === "error" ? rawLevel : "success";

  return { level, message };
}

export function buildInvoiceActionErrorNotice(error: unknown, fallbackMessage: string): InvoiceActionNotice {
  const message = error instanceof Error && error.message ? error.message : fallbackMessage;

  return {
    level: "warning",
    message: `${fallbackMessage} ${message === fallbackMessage ? "" : `(${message})`}`.trim()
  };
}

export function isRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}
