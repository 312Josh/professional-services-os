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

      <section className="card">
        <h2>{appConfig.copy.leadIntakeTitle}</h2>
        <p className="muted">{appConfig.copy.leadIntakeSubtitle}</p>
        <p className="notice warning" style={{ marginBottom: "0.9rem" }}>
          {appConfig.copy.leadIntakePromiseLine}
        </p>
        <p className="muted">{appConfig.copy.leadIntakeContactRequirement}</p>
        {appConfig.trustLayer.mode === "minimal" ? (
          <div className="owner-trust-points">
            {appConfig.trustLayer.proofPoints.map((point) => (
              <span key={point} className="badge">
                {point}
              </span>
            ))}
          </div>
        ) : null}
        <form method="post" action="/api/leads" className="grid three" style={{ marginTop: "0.9rem" }}>
          <label>
            Name
            <input name="name" required placeholder="Property owner or decision maker" />
          </label>
          <label>
            Phone
            <input name="phone" placeholder="Best callback number" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="Best email for estimate and follow-up" />
          </label>
          <label>
            Address
            <input name="address" placeholder="Service location" />
          </label>
          <label>
            Source
            <input name="source" placeholder={appConfig.copy.leadDefaultSource} defaultValue={appConfig.copy.leadDefaultSource} />
          </label>
          <label>
            Service requested
            <input name="serviceRequested" required placeholder="What they need solved" />
          </label>
          <label>
            Request urgency
            <select name="requestUrgency" defaultValue="ASAP">
              <option value="ASAP">ASAP</option>
              <option value="Today">Today</option>
              <option value="This week">This week</option>
              <option value="Not urgent">Not urgent</option>
            </select>
          </label>
          <label>
            Preferred contact
            <select name="preferredContactMethod" defaultValue="Phone">
              <option value="Phone">Phone</option>
              <option value="Text">Text</option>
              <option value="Email">Email</option>
            </select>
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Intake note
            <textarea
              name="intakeNote"
              placeholder="Decision urgency, budget concerns, timing constraints, or anything needed for a faster close"
            />
          </label>
          <button type="submit">{appConfig.copy.leadIntakeCta}</button>
        </form>
      </section>

      <section className="card">
        <h2>All Leads</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Status</th>
                <th>Signal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const signal = signalMap.get(lead.id);
                const signalLabel = signal?.isStale
                  ? "Stale"
                  : signal?.isFollowUpNeeded
                    ? "Follow-up needed"
                    : signal?.isResponseLate
                      ? "Response late"
                      : signal?.isJustArrived
                        ? "Just arrived"
                        : "Stable";
                const rowClassName = signal?.isStale
                  ? "lead-row lead-row-stale"
                  : signal?.isFollowUpNeeded
                    ? "lead-row lead-row-followup"
                    : signal?.isJustArrived
                      ? "lead-row lead-row-fresh"
                      : "lead-row";

                return (
                  <tr key={lead.id} className={rowClassName}>
                    <td>
                      <strong>{lead.name}</strong>
                      <div className="muted">{formatDate(lead.createdAt)}</div>
                    </td>
                    <td>
                      <div>{lead.phone || "-"}</div>
                      <div className="muted">{lead.email || "-"}</div>
                    </td>
                    <td>{lead.serviceRequested || "-"}</td>
                    <td>
                      <span className="badge">{getLeadStatusLabel(lead.status)}</span>
                      {lead.disqualifyReason ? <div className="muted">Reason: {lead.disqualifyReason}</div> : null}
                      {lead.convertedCustomer ? (
                        <div className="muted">Customer: {lead.convertedCustomer.name}</div>
                      ) : null}
                    </td>
                    <td>
                      {signalLabel}
                      {signal ? (
                        <div className="muted">
                          Created {formatMinutesAgo(signal.ageMinutes)}; touched {formatMinutesAgo(signal.lastTouchedMinutes)}
                        </div>
                      ) : null}
                      {signal?.isNewUnworked && !signal.isStale ? (
                        <div className="muted">Stale in {formatMinutesRemaining(signal.minutesUntilStale ?? 0)}</div>
                      ) : null}
                    </td>
                    <td>
                      <div className="row-actions">
                        <form method="post" action={`/api/leads/${lead.id}/status`}>
                          <select name="status" defaultValue={lead.status.toLowerCase()}>
                            {LEAD_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {LEAD_STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                          <input name="disqualifyReason" placeholder="Disqualify reason" />
                          <button type="submit" className="secondary">
                            Update Status
                          </button>
                        </form>

                        {lead.convertedCustomerId ? null : (
                          <form method="post" action={`/api/leads/${lead.id}/convert`}>
                            <button type="submit" className="success">
                              Convert to Customer
                            </button>
                          </form>
                        )}

                        <form method="post" action={`/api/leads/${lead.id}/notes`}>
                          <input name="note" placeholder="Add note" required />
                          <button type="submit">Save Note</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
