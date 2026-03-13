import { getJobStatusLabel, JOB_SOURCE_LEAD_STATUSES, JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function JobsPage() {
  const [jobs, customers, leads] = await Promise.all([
    prisma.job.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.lead.findMany({ where: { status: { in: [...JOB_SOURCE_LEAD_STATUSES] } }, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>Jobs</h1>
        <form method="post" action="/api/jobs" className="grid three">
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Customer
            <select name="customerId" required defaultValue="">
              <option value="" disabled>
                Select customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Source lead (optional)
            <select name="leadId" defaultValue="">
              <option value="">No lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Service date
            <input name="serviceDate" type="date" />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Description
            <textarea name="description" />
          </label>
          <button type="submit">Create Job</button>
        </form>
      </section>

      <section className="card">
        <h2>Job Board</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.customer.name}</td>
                  <td>{getJobStatusLabel(job.status)}</td>
                  <td>{formatDate(job.serviceDate)}</td>
                  <td>
                    <div className="row-actions">
                      <form method="post" action={`/api/jobs/${job.id}/status`}>
                        <select name="status" defaultValue={job.status.toLowerCase()}>
                          {JOB_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {JOB_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="secondary">
                          Update
                        </button>
                      </form>
                      <form method="post" action={`/api/jobs/${job.id}/notes`}>
                        <input type="hidden" name="customerId" value={job.customerId} />
                        <input name="note" placeholder="Job note" required />
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
