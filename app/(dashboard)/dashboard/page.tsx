export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  DASHBOARD_OPEN_INVOICE_STATUSES,
  getInvoiceStatusLabel,
  getLeadStatusLabel
} from "@/lib/constants";
import { appConfig } from "@/lib/app-config";
import {
  buildLeadSignals,
  formatMinutesAgo,
  formatMinutesRemaining,
  summarizeLeadSignals
} from "@/lib/lead-signals";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import { OwnerMetricCard, UrgencyBanner } from "@/app/(dashboard)/_components/owner-panels";
import {
  LeadNotificationBar,
  ResponseTimeCard,
  MissedLeadBadge,
  ActivityFeed,
  CompetitorComparison,
  ReviewToast,
  WeeklyDigest
} from "@/app/(dashboard)/_components/sticky-widgets";
import {
  getDemoLeadCount,
  getDemoResponseTime,
  getDemoMissedLeads,
  getDemoActivityFeed,
  getDemoCompetitorComparison,
  getDemoWeeklyDigest
} from "@/lib/sticky-demo";
// ResponseCadencePanel moved to /lead-response page
import { SpeedToLeadHero } from "@/app/(dashboard)/_components/speed-to-lead-hero";

export default async function DashboardPage() {
  const now = new Date();

  // Sticky engagement data (demo mode)
  const demoLeadCount = getDemoLeadCount();
  const demoResponse = getDemoResponseTime();
  const demoMissed = getDemoMissedLeads();
  const demoFeed = getDemoActivityFeed();
  const demoComparison = getDemoCompetitorComparison();
  const demoDigest = getDemoWeeklyDigest();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [leadPool, openInvoices, recentInvoices, recentLeads, recentlyBookedJobs, todaysJobs] = await Promise.all([
    prisma.lead.findMany({
      where: { status: { in: ["new", "contacted"] } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.invoice.findMany({
      where: { status: { in: [...DASHBOARD_OPEN_INVOICE_STATUSES] } },
      include: { customer: true },
      orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }]
    }),
    prisma.invoice.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.job.findMany({
      where: { createdAt: { gte: oneWeekAgo }, status: { not: "cancelled" } },
      include: { customer: true, lead: true },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.job.findMany({
      where: {
        status: { in: ["scheduled", "in_progress"] },
        serviceDate: { gte: todayStart, lt: todayEnd }
      },
      include: { customer: true },
      orderBy: { serviceDate: "asc" }
    })
  ]);

  const leadSignals = buildLeadSignals(leadPool, appConfig.ownerOps, now);
  const leadSummary = summarizeLeadSignals(leadSignals);
  const overdueSentInvoices = openInvoices.filter(
    (invoice) => invoice.status === "sent" && invoice.dueDate && invoice.dueDate.getTime() < now.getTime()
  );
  const unpaidTotalCents = openInvoices.reduce((sum, invoice) => sum + invoice.totalCents, 0);
  const overdueTotalCents = overdueSentInvoices.reduce((sum, invoice) => sum + invoice.totalCents, 0);
  const moneyAtRiskCents = overdueTotalCents + leadSummary.slippingRevenueCents;
  const attentionNowCount = leadSummary.attentionNowCount + overdueSentInvoices.length;
  const leadLeakageQueue = leadSignals
    .filter((signal) => signal.isStale || signal.isFollowUpNeeded)
    .sort((a, b) => b.riskRevenueCents - a.riskRevenueCents || b.ageMinutes - a.ageMinutes)
    .slice(0, 6);
  const firstTouchQueue = leadSignals
    .filter((signal) => signal.isNewUnworked)
    .sort((a, b) => b.ageMinutes - a.ageMinutes)
    .slice(0, 6);

  const nextActions: Array<{ title: string; detail: string; href: string }> = [];
  if (leadSummary.staleCount > 0 || leadSummary.followUpNeededCount > 0) {
    nextActions.push({
      title: "Rescue stale and follow-up leads",
      detail: `${leadSummary.staleCount + leadSummary.followUpNeededCount} leads are drifting without progress.`,
      href: "/leads#priority-queue"
    });
  }
  if (leadSummary.responseLateCount > 0) {
    nextActions.push({
      title: "Recover response-late leads",
      detail: `${leadSummary.responseLateCount} new leads missed first-touch pace and need immediate response.`,
      href: "/leads#priority-queue"
    });
  }
  if (leadSummary.justArrivedCount > 0) {
    nextActions.push({
      title: "Respond to fresh leads first",
      detail: `${leadSummary.justArrivedCount} new leads arrived within ${appConfig.ownerOps.newLeadAlertMinutes} minutes.`,
      href: "/leads#priority-queue"
    });
  }
  if (overdueSentInvoices.length > 0) {
    nextActions.push({
      title: "Collect overdue receivables",
      detail: `${overdueSentInvoices.length} sent invoice${overdueSentInvoices.length === 1 ? "" : "s"} are overdue.`,
      href: "/invoices"
    });
  }
  if (nextActions.length === 0) {
    nextActions.push({
      title: "No red flags detected",
      detail: "Keep the queue moving by touching every new lead before it turns stale.",
      href: "/leads#priority-queue"
    });
  }

  const trustModeLabel = appConfig.trustLayer.mode === "minimal" ? "Build now: minimal layer" : "Deferred";
  const proofPointCount = appConfig.trustLayer.proofPoints.length;
  const recommendedTrustMode = proofPointCount >= appConfig.trustLayer.minProofPointsToBuild ? "minimal" : "defer";
  const trustModeAligned = recommendedTrustMode === appConfig.trustLayer.mode;
  const trustDecisionSummary = appConfig.trustLayer.mode === "minimal"
    ? appConfig.copy.trustLayerBuildDecisionSummary
    : appConfig.copy.trustLayerDeferDecisionSummary;
  const trustRecommendationText = trustModeAligned
    ? `Decision aligned with readiness threshold (${proofPointCount}/${appConfig.trustLayer.minProofPointsToBuild} proof points).`
    : `Readiness check suggests "${recommendedTrustMode}" (${proofPointCount}/${appConfig.trustLayer.minProofPointsToBuild} proof points).`;

  // Pick a recent lead for the notification bar
  const latestLead = recentLeads[0];

  return (
    <>
      {/* Speed-to-Lead Hero */}
      <SpeedToLeadHero
        avgResponseMinutes={demoResponse.avg}
        avgResponseSeconds={Math.floor(Math.random() * 59)}
        todayResponseRate={Math.min(100, Math.floor(100 - demoMissed * 15))}
        missedLeadsToday={demoMissed}
        leadsReceivedToday={demoLeadCount}
        leadsRespondedToday={demoLeadCount - demoMissed}
      />

      {/* Sticky: Lead notification bar */}
      <LeadNotificationBar
        count={demoLeadCount}
        latestName={latestLead?.name || "Sarah M."}
        latestService={latestLead?.serviceRequested || "Emergency Service"}
      />

      {/* Sticky: Missed lead alert */}
      <MissedLeadBadge count={demoMissed} />

      <div className="topbar">
        <div>
          <h1>{appConfig.copy.dashboardTitle}</h1>
          <p className="muted">{appConfig.copy.dashboardSubtitle}</p>
        </div>
      </div>

      <UrgencyBanner
        title={appConfig.copy.dashboardLeadAlertTitle}
        count={leadSummary.attentionNowCount}
        message={`${appConfig.copy.dashboardLeadAlertSubtitle} Response late: ${leadSummary.responseLateCount}. Stale: ${leadSummary.staleCount}. Follow-up needed: ${leadSummary.followUpNeededCount}.`}
        href="/leads#priority-queue"
        ctaLabel="Open Lead Queue"
      />

      <div className="grid four" style={{ marginBottom: "1.5rem", marginTop: "1.5rem" }}>
        <OwnerMetricCard
          title="New leads"
          value={String(leadSummary.newUnworkedCount)}
          detail={leadSummary.newUnworkedCount > 0 ? "Need response now" : "All leads worked"}
          tone={leadSummary.newUnworkedCount > 0 ? "danger" : "success"}
          href="/leads#priority-queue"
          ctaLabel="Work leads"
        />
        <OwnerMetricCard
          title="Today's jobs"
          value={String(todaysJobs.length)}
          detail={todaysJobs.length > 0 ? todaysJobs.map(j => j.title).slice(0, 2).join(", ") : "No jobs scheduled today"}
          tone={todaysJobs.length > 0 ? "success" : "warning"}
          href="/jobs"
          ctaLabel="View schedule"
        />
        <OwnerMetricCard
          title="Unpaid invoices"
          value={formatCurrency(unpaidTotalCents)}
          detail={`${openInvoices.length} open · ${overdueSentInvoices.length} overdue`}
          tone={overdueSentInvoices.length > 0 ? "danger" : unpaidTotalCents > 0 ? "warning" : "success"}
          href="/invoices"
          ctaLabel="Collect"
        />
        <OwnerMetricCard
          title="Missed leads"
          value={String(leadSummary.staleCount + leadSummary.followUpNeededCount)}
          detail={leadSummary.staleCount + leadSummary.followUpNeededCount > 0 ? `${formatCurrency(leadSummary.slippingRevenueCents)} at risk` : "No missed leads"}
          tone={leadSummary.staleCount > 0 ? "danger" : leadSummary.followUpNeededCount > 0 ? "warning" : "success"}
          href="/leads#priority-queue"
          ctaLabel="Rescue"
        />
      </div>

      <div className="grid two" style={{ marginTop: "1.5rem" }}>
        <section className="card">
          <h2>Do Next</h2>
          <div className="owner-action-list">
            {nextActions.map((action, index) => (
              <Link key={action.title} href={action.href} className="owner-action-item">
                <strong>{index + 1}. {action.title}</strong>
                <div className="muted">{action.detail}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>{appConfig.copy.trustLayerTitle}</h2>
          <p className="badge owner-trust-badge">{trustModeLabel}</p>
          <p className={`notice ${trustModeAligned ? "success" : "warning"}`} style={{ marginBottom: "0.7rem" }}>
            {trustRecommendationText}
          </p>
          <p className="muted">{trustDecisionSummary}</p>
          {appConfig.trustLayer.mode === "minimal" ? (
            <>
              <p className="muted">{appConfig.copy.trustLayerMinimalSummary}</p>
              <ul className="owner-bullet-list">
                {appConfig.trustLayer.proofPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted">{appConfig.copy.trustLayerDeferredSummary}</p>
          )}
        </section>
      </div>

      <div className="grid two" style={{ marginTop: "1.5rem" }}>
        <section className="card">
          <h2>{appConfig.copy.dashboardFirstTouchTitle}</h2>
          <p className="muted">{appConfig.copy.dashboardFirstTouchSubtitle}</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Age</th>
                  <th>SLA</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {firstTouchQueue.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No new leads are waiting for first touch.</td>
                  </tr>
                ) : (
                  firstTouchQueue.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.name}</strong>
                        <div className="muted">{lead.serviceRequested || "-"}</div>
                      </td>
                      <td>{formatMinutesAgo(lead.ageMinutes)}</td>
                      <td>
                        <span
                          className={
                            lead.isStale
                              ? "sla-chip danger"
                              : lead.isResponseLate
                                ? "sla-chip warning"
                                : "sla-chip success"
                          }
                        >
                          {lead.isStale ? "Missed" : lead.isResponseLate ? "Late" : "On pace"}
                        </span>
                        <div className="muted">
                          {lead.isStale
                            ? `Exceeded ${appConfig.ownerOps.staleLeadHours}h stale threshold`
                            : `Stale in ${formatMinutesRemaining(lead.minutesUntilStale ?? 0)}`}
                        </div>
                      </td>
                      <td>
                        <div>{lead.phone || "-"}</div>
                        <div className="muted">{lead.email || "-"}</div>
                      </td>
                      <td>
                        <div className="priority-actions">
                          <form method="post" action={`/api/leads/${lead.id}/status`}>
                            <input type="hidden" name="status" value="contacted" />
                            <button type="submit" className="secondary">
                              Mark Contacted
                            </button>
                          </form>
                          <Link href="/leads#priority-queue">Open Queue</Link>
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
          <h2>Unpaid Invoice Watchlist</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Due</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {openInvoices.slice(0, 6).map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td>{invoice.customer.name}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>{formatCurrency(invoice.totalCents)}</td>
                    <td>{getInvoiceStatusLabel(invoice.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2>Lead Leakage Watchlist</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Issue</th>
                  <th>Service</th>
                  <th>At risk</th>
                </tr>
              </thead>
              <tbody>
                {leadLeakageQueue.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No stale/follow-up lead leakage detected.</td>
                  </tr>
                ) : (
                  leadLeakageQueue.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.name}</strong>
                        <div className="muted">{getLeadStatusLabel(lead.status)}</div>
                      </td>
                      <td>
                        {lead.isStale ? "Stale new lead" : "Follow-up needed"}
                        <div className="muted">
                          Created {formatMinutesAgo(lead.ageMinutes)}; touched {formatMinutesAgo(lead.lastTouchedMinutes)}
                        </div>
                      </td>
                      <td>{lead.serviceRequested || "-"}</td>
                      <td>{formatCurrency(lead.riskRevenueCents)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {(leadSummary.staleCount > 0 || leadSummary.followUpNeededCount > 0) && (
        <section className="card" style={{ marginTop: "1.5rem", borderLeft: "4px solid var(--danger)" }}>
          <h2>⚠️ Missed Leads — Needs Rescue</h2>
          <p className="muted">These leads went cold. Every hour without contact drops conversion probability.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Time Since Submission</th>
                  <th>Issue</th>
                  <th>Revenue at Risk</th>
                  <th>Rescue</th>
                </tr>
              </thead>
              <tbody>
                {leadLeakageQueue.map((lead) => (
                  <tr key={lead.id} className="lead-row lead-row-stale">
                    <td>
                      <strong>{lead.name}</strong>
                      <div className="muted">{lead.serviceRequested || "—"}</div>
                      <div className="muted">{lead.phone || lead.email || "No contact"}</div>
                    </td>
                    <td>
                      <strong style={{ color: "var(--danger)", fontSize: "1.1em" }}>{formatMinutesAgo(lead.ageMinutes)}</strong>
                      <div className="muted">Submitted {formatDate(lead.createdAt)}</div>
                    </td>
                    <td>
                      <span className={`badge ${lead.isStale ? "danger" : "warning"}`}>
                        {lead.isStale ? "Stale — no response" : "Follow-up overdue"}
                      </span>
                      <div className="muted">Last touched {formatMinutesAgo(lead.lastTouchedMinutes)}</div>
                    </td>
                    <td><strong>{formatCurrency(lead.riskRevenueCents)}</strong></td>
                    <td>
                      <div className="priority-actions">
                        {lead.phone ? <a href={`tel:${lead.phone}`}>📞 Call Now</a> : null}
                        {lead.email ? <a href={`mailto:${lead.email}`}>📧 Email</a> : null}
                        {lead.isNewUnworked ? (
                          <form method="post" action={`/api/leads/${lead.id}/status`}>
                            <input type="hidden" name="status" value="contacted" />
                            <button type="submit" className="secondary">Mark Contacted</button>
                          </form>
                        ) : (
                          <form method="post" action={`/api/leads/${lead.id}/notes`}>
                            <input type="hidden" name="note" value="Rescue follow-up attempted from dashboard." />
                            <button type="submit" className="secondary">Log Follow-up</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid two" style={{ marginTop: "1.5rem" }}>
        <section className="card">
          <h2>What Got Booked</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Customer</th>
                  <th>Booked</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {recentlyBookedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No jobs booked in the last 7 days.</td>
                  </tr>
                ) : (
                  recentlyBookedJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                      </td>
                      <td>{job.customer.name}</td>
                      <td>{formatDate(job.createdAt)}</td>
                      <td>{job.lead ? job.lead.name : "Direct/customer repeat"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2>Recent Lead Flow</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{getLeadStatusLabel(lead.status)}</td>
                    <td>{lead.serviceRequested || "-"}</td>
                    <td>{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ marginTop: "0.8rem" }}>
            Last 5 invoices created:
            {" "}
            {recentInvoices.map((invoice) => invoice.invoiceNumber).join(", ")}
          </p>
        </section>
      </div>

      {/* Sticky engagement widgets */}
      <div className="grid two" style={{ marginTop: "1.5rem" }}>
        {/* Response Time + Competitor Comparison */}
        <div className="grid" style={{ gap: "1rem" }}>
          <ResponseTimeCard avg={demoResponse.avg} trend={demoResponse.trend} prevAvg={demoResponse.prevAvg} />
          <CompetitorComparison yours={demoComparison.yours} industryHours={47} multiplier={demoComparison.multiplier} />
        </div>

        {/* Activity Feed */}
        <section className="card">
          <h2>Live Activity</h2>
          <ActivityFeed items={demoFeed} />
        </section>
      </div>

      {/* Weekly Digest */}
      <div style={{ marginTop: "1.5rem" }}>
        <WeeklyDigest data={demoDigest} />
      </div>

      {/* Lead Response Automation → moved to /lead-response */}

      {/* Review notification toast (shows most recent simulated review) */}
      {demoFeed.find((f) => f.type === "review") && (
        <ReviewToast
          name={demoFeed.find((f) => f.type === "review")!.text.replace(/⭐ New \d-star review from /, "")}
          rating={5}
        />
      )}
    </>
  );
}
