type LeadSignalInput = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  serviceRequested: string | null;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type LeadSignalConfig = {
  newLeadAlertMinutes: number;
  staleLeadHours: number;
  followUpLeadHours: number;
  defaultLeadValueCents: number;
};

export type LeadSignal = LeadSignalInput & {
  ageMinutes: number;
  lastTouchedMinutes: number;
  minutesUntilStale: number | null;
  isNewUnworked: boolean;
  isJustArrived: boolean;
  isResponseLate: boolean;
  isStale: boolean;
  isFollowUpNeeded: boolean;
  needsActionNow: boolean;
  riskRevenueCents: number;
};

export type LeadSignalSummary = {
  newUnworkedCount: number;
  justArrivedCount: number;
  responseLateCount: number;
  staleCount: number;
  followUpNeededCount: number;
  slippingRevenueCents: number;
  attentionNowCount: number;
};

function clampToMinutes(value: number): number {
  return Math.max(0, Math.floor(value));
}

export function formatMinutesAgo(minutes: number): string {
  if (minutes < 1) {
    return "now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (minutes < 60 * 24) {
    return `${Math.floor(minutes / 60)}h ago`;
  }

  return `${Math.floor(minutes / (60 * 24))}d ago`;
}

export function formatMinutesRemaining(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));

  if (safeMinutes < 60) {
    return `${safeMinutes}m left`;
  }

  if (safeMinutes < 60 * 24) {
    return `${Math.floor(safeMinutes / 60)}h left`;
  }

  return `${Math.floor(safeMinutes / (60 * 24))}d left`;
}

export function buildLeadSignals(
  leads: LeadSignalInput[],
  config: LeadSignalConfig,
  now: Date = new Date()
): LeadSignal[] {
  const staleMinutes = config.staleLeadHours * 60;
  const followUpMinutes = config.followUpLeadHours * 60;

  return leads.map((lead) => {
    const ageMinutes = clampToMinutes((now.getTime() - lead.createdAt.getTime()) / (1000 * 60));
    const lastTouchedMinutes = clampToMinutes((now.getTime() - lead.updatedAt.getTime()) / (1000 * 60));
    const isNewUnworked = lead.status === "new";
    const isJustArrived = isNewUnworked && ageMinutes <= config.newLeadAlertMinutes;
    const minutesUntilStale = isNewUnworked ? Math.max(0, staleMinutes - ageMinutes) : null;
    const isStale = isNewUnworked && ageMinutes >= staleMinutes;
    const isResponseLate = isNewUnworked && ageMinutes > config.newLeadAlertMinutes && !isStale;
    const isFollowUpNeeded = lead.status === "contacted" && lastTouchedMinutes >= followUpMinutes;
    const needsActionNow = isJustArrived || isResponseLate || isStale || isFollowUpNeeded;
    const riskRevenueCents = isStale || isFollowUpNeeded
      ? config.defaultLeadValueCents
      : isResponseLate
        ? Math.round(config.defaultLeadValueCents * 0.5)
        : 0;

    return {
      ...lead,
      ageMinutes,
      lastTouchedMinutes,
      minutesUntilStale,
      isNewUnworked,
      isJustArrived,
      isResponseLate,
      isStale,
      isFollowUpNeeded,
      needsActionNow,
      riskRevenueCents
    };
  });
}

export function summarizeLeadSignals(signals: LeadSignal[]): LeadSignalSummary {
  const newUnworkedCount = signals.filter((signal) => signal.isNewUnworked).length;
  const justArrivedCount = signals.filter((signal) => signal.isJustArrived).length;
  const responseLateCount = signals.filter((signal) => signal.isResponseLate).length;
  const staleCount = signals.filter((signal) => signal.isStale).length;
  const followUpNeededCount = signals.filter((signal) => signal.isFollowUpNeeded).length;
  const slippingRevenueCents = signals.reduce((sum, signal) => sum + signal.riskRevenueCents, 0);
  const attentionNowCount = signals.filter((signal) => signal.needsActionNow).length;

  return {
    newUnworkedCount,
    justArrivedCount,
    responseLateCount,
    staleCount,
    followUpNeededCount,
    slippingRevenueCents,
    attentionNowCount
  };
}
