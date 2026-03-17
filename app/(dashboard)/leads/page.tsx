export const dynamic = "force-dynamic";
import { appConfig } from "@/lib/app-config";
import { getLeadStatusLabel, LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/constants";
import {
  buildLeadSignals,
  formatMinutesAgo,
  formatMinutesRemaining,
  summarizeLeadSignals
} from "@/lib/lead-signals";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { OwnerMetricCard, UrgencyBanner } from "@/app/(dashboard)/_components/owner-panels";
import { LeadsTable } from "@/app/(dashboard)/_components/leads-table";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { convertedCustomer: true },
    orderBy: { createdAt: "desc" }
  });

  const leadSignals = buildLeadSignals(leads, appConfig.ownerOps);
  const leadSummary = summarizeLeadSignals(leadSignals);
  const signalMap = new Map(leadSignals.map((signal) => [signal.id, signal]));
  const actionQueue = leadSignals
    .filter((signal) => signal.needsActionNow)
    .sort((a, b) => {
      const aPriority = a.isStale ? 0 : a.isFollowUpNeeded ? 1 : a.isResponseLate ? 2 : a.isJustArrived ? 3 : 4;
      const bPriority = b.isStale ? 0 : b.isFollowUpNeeded ? 1 : b.isResponseLate ? 2 : b.isJustArrived ? 3 : 4;
      return aPriority - bPriority || b.ageMinutes - a.ageMinutes;
    })
    .slice(0, 12);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>{appConfig.copy.leadsTitle}</h1>
        <p className="muted">{appConfig.copy.leadsSubtitle}</p>
      </section>

      <UrgencyBanner
        title={appConfig.copy.leadsAlertTitle}
        count={leadSummary.attentionNowCount}
        message={`${leadSummary.newUnworkedCount} unworked, ${leadSummary.responseLateCount} response late, ${leadSummary.staleCount} stale, ${leadSummary.followUpNeededCount} follow-up needed.`}
        href="#priority-queue"
        ctaLabel="Jump to Priority Queue"
      />

      <div className="grid four">
        <OwnerMetricCard
          title="New & unworked"
          value={String(leadSummary.newUnworkedCount)}
          detail="New leads waiting for first touch"
          tone={leadSummary.newUnworkedCount > 0 ? "warning" : "success"}
          href="#priority-queue"
          ctaLabel="Work now"
        />
        <OwnerMetricCard
          title="Response late"
          value={String(leadSummary.responseLateCount)}
          detail={`New leads older than ${appConfig.ownerOps.newLeadAlertMinutes}m`}
          tone={leadSummary.responseLateCount > 0 ? "warning" : "success"}
          href="#priority-queue"
          ctaLabel="Recover"
        />
        <OwnerMetricCard
          title="Stale leads"
          value={String(leadSummary.staleCount)}
          detail={`New leads older than ${appConfig.ownerOps.staleLeadHours}h`}
          tone={leadSummary.staleCount > 0 ? "danger" : "success"}
          href="#priority-queue"
          ctaLabel="Rescue"
        />
        <OwnerMetricCard
          title="Follow-up needed"
          value={String(leadSummary.followUpNeededCount)}
          detail={`Contacted leads untouched for ${appConfig.ownerOps.followUpLeadHours}h+`}
          tone={leadSummary.followUpNeededCount > 0 ? "warning" : "success"}
          href="#priority-queue"
          ctaLabel="Re-engage"
        />
        <OwnerMetricCard
          title="Revenue slipping"
          value={formatCurrency(leadSummary.slippingRevenueCents)}
          detail={`Assumes ${formatCurrency(appConfig.ownerOps.defaultLeadValueCents)} average lead value`}
          tone={leadSummary.slippingRevenueCents > 0 ? "danger" : "success"}
          href="#priority-queue"
          ctaLabel="Close leaks"
        />
      </div>

      <section className="card" id="priority-queue">
        <h2>{appConfig.copy.leadPriorityQueueTitle}</h2>
        <p className="muted">{appConfig.copy.leadPriorityQueueSubtitle}</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Signal</th>
                <th>Source</th>
                <th>At risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {actionQueue.length === 0 ? (
                <tr>
                  <td colSpan={5}>No urgent leads right now.</td>
                </tr>
              ) : (
                actionQueue.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.name}</strong>
                      <div className="muted">{lead.serviceRequested || "No service entered"}</div>
                    </td>
                    <td>
                      {lead.isStale
                        ? "Stale new lead"
                        : lead.isFollowUpNeeded
                          ? "Follow-up needed"
                          : lead.isResponseLate
                            ? "Response late"
                            : "Just arrived"}
                      <div className="muted">
                        Created {formatMinutesAgo(lead.ageMinutes)}; touched {formatMinutesAgo(lead.lastTouchedMinutes)}
                      </div>
                      {lead.isNewUnworked && !lead.isStale ? (
                        <div className="muted">Stale in {formatMinutesRemaining(lead.minutesUntilStale ?? 0)}</div>
                      ) : null}
                    </td>
                    <td>{lead.source || appConfig.copy.leadDefaultSource}</td>
                    <td>{formatCurrency(lead.riskRevenueCents)}</td>
                    <td>
                      <div className="priority-actions">
                        {lead.phone ? <a href={`tel:${lead.phone}`}>Call</a> : null}
                        {lead.email ? <a href={`mailto:${lead.email}`}>Email</a> : null}
                        {lead.isNewUnworked ? (
                          <form method="post" action={`/api/leads/${lead.id}/status`}>
                            <input type="hidden" name="status" value="contacted" />
                            <button type="submit" className="secondary">
                              Mark Contacted
                            </button>
                          </form>
                        ) : null}
                        {lead.isFollowUpNeeded ? (
                          <form method="post" action={`/api/leads/${lead.id}/notes`}>
                            <input type="hidden" name="note" value="Follow-up touch logged from priority queue." />
                            <button type="submit" className="secondary">
                              Log Follow-up Touch
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-1">{appConfig.copy.leadIntakeTitle}</h2>
        <p className="text-sm text-slate-500 mb-4">{appConfig.copy.leadIntakeSubtitle}</p>

        {/* Tip box */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <span className="text-amber-500 text-lg mt-0.5">💡</span>
          <div>
            <p className="text-sm font-medium text-amber-800">{appConfig.copy.leadIntakePromiseLine}</p>
            <p className="text-xs text-amber-600 mt-1">{appConfig.copy.leadIntakeContactRequirement}</p>
          </div>
        </div>

        <form method="post" action="/api/leads">
          {/* Row 1: Name + Phone */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name *</label>
              <input name="name" required placeholder="Property owner or decision maker" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
              <input name="phone" placeholder="Best callback number" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
          </div>

          {/* Row 2: Email + Address */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input name="email" type="email" placeholder="Best email for estimate and follow-up" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
              <input name="address" placeholder="Service location" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
          </div>

          {/* Row 3: Source + Service requested */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Source</label>
              <input name="source" placeholder={appConfig.copy.leadDefaultSource} defaultValue={appConfig.copy.leadDefaultSource} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Requested *</label>
              <input name="serviceRequested" required placeholder="What they need solved" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
          </div>

          {/* Row 4: Urgency + Preferred contact */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Request Urgency</label>
              <select name="requestUrgency" defaultValue="ASAP" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                <option value="ASAP">ASAP</option>
                <option value="Today">Today</option>
                <option value="This week">This week</option>
                <option value="Not urgent">Not urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Contact</label>
              <select name="preferredContactMethod" defaultValue="Phone" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                <option value="Phone">Phone</option>
                <option value="Text">Text</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          {/* Row 5: Intake note (full width) */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Intake Note</label>
            <textarea name="intakeNote" rows={5} placeholder="Decision urgency, budget concerns, timing constraints, or anything needed for a faster close" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white resize-y min-h-[120px]" />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm shadow-amber-500/20 hover:shadow-amber-400/30 transition-all cursor-pointer">
              {appConfig.copy.leadIntakeCta}
            </button>
          </div>
        </form>
      </section>

      <LeadsTable leads={leads.map((lead) => {
        const signal = signalMap.get(lead.id);
        const signalLabel = signal?.isStale ? "Stale" : signal?.isFollowUpNeeded ? "Follow-up" : signal?.isResponseLate ? "Late" : signal?.isJustArrived ? "New" : "OK";
        const signalColor = signal?.isStale ? "bg-red-50 text-red-700 border-red-200" : signal?.isFollowUpNeeded ? "bg-amber-50 text-amber-700 border-amber-200" : signal?.isResponseLate ? "bg-orange-50 text-orange-700 border-orange-200" : signal?.isJustArrived ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200";
        const rowBg = signal?.isStale ? "bg-red-50/30" : signal?.isJustArrived ? "bg-blue-50/20" : "";
        return {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          serviceRequested: lead.serviceRequested,
          status: lead.status,
          statusLabel: getLeadStatusLabel(lead.status),
          convertedCustomerId: lead.convertedCustomerId,
          convertedCustomerName: lead.convertedCustomer?.name || null,
          createdAt: formatDate(lead.createdAt),
          signalLabel,
          signalColor,
          age: signal ? `${formatMinutesAgo(signal.ageMinutes)} old` : "",
          rowBg,
        };
      })} />
    </div>
  );
}
