import {
  addLeadNoteAction,
  convertLeadToCustomerAction,
  createLeadAction,
  updateLeadStatusAction
} from "@/lib/actions";
import { LEAD_STATUSES } from "@/lib/constants";
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
        <form action={createLeadAction} className="grid three">
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
                    <span className="badge">{lead.status.toLowerCase()}</span>
                    {lead.disqualifyReason ? <div className="muted">Reason: {lead.disqualifyReason}</div> : null}
                    {lead.convertedCustomer ? (
                      <div className="muted">Customer: {lead.convertedCustomer.name}</div>
                    ) : null}
                  </td>
                  <td>
                    <div className="row-actions">
                      <form action={updateLeadStatusAction}>
                        <input type="hidden" name="leadId" value={lead.id} />
                        <select name="status" defaultValue={lead.status}>
                          {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.toLowerCase()}
                            </option>
                          ))}
                        </select>
                        <input name="disqualifyReason" placeholder="Disqualify reason" />
                        <button type="submit" className="secondary">
                          Update Status
                        </button>
                      </form>

                      {lead.convertedCustomerId ? null : (
                        <form action={convertLeadToCustomerAction}>
                          <input type="hidden" name="leadId" value={lead.id} />
                          <button type="submit" className="success">
                            Convert to Customer
                          </button>
                        </form>
                      )}

                      <form action={addLeadNoteAction}>
                        <input type="hidden" name="leadId" value={lead.id} />
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
