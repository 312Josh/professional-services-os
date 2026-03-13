import { getLeadStatusLabel, LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { convertedCustomer: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>Leads</h1>
        <p className="muted">Statuses: new, contacted, converted, disqualified.</p>
        <form method="post" action="/api/leads" className="grid three">
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Phone
            <input name="phone" />
          </label>
          <label>
            Email
            <input name="email" type="email" />
          </label>
          <label>
            Address
            <input name="address" />
          </label>
          <label>
            Source
            <input name="source" placeholder="Google, referral, etc" />
          </label>
          <label>
            Service requested
            <input name="serviceRequested" placeholder="Drain cleaning" />
          </label>
          <button type="submit">Create Lead</button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
