export const dynamic = "force-dynamic";
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function NewInvoicePage() {
  const [customers, jobs] = await Promise.all([
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.job.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <section className="card">
      <h1>Create Invoice</h1>
      <p className="muted">
        Line items format: <code>Description|Quantity|Unit Price</code> (one line per item).
      </p>
      <form method="post" action="/api/invoices" className="grid two">
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
          Related job (optional)
          <select name="jobId" defaultValue="">
            <option value="">No job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.customer.name})
              </option>
            ))}
          </select>
        </label>

        <label>
          Issue date
          <input name="issueDate" type="date" />
        </label>

        <label>
          Due date
          <input name="dueDate" type="date" />
        </label>

        <label>
          Tax rate %
          <input name="taxRatePercent" defaultValue="8.25" />
        </label>

        <label>
          Initial status
          <select name="status" defaultValue="draft">
            {INVOICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {INVOICE_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          Line items
          <textarea
            name="lineItems"
            required
            defaultValue={"Service Call|1|95\nPipe Materials|1|68\nLabor Hours|2|80"}
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          Notes
          <textarea name="notes" placeholder="Optional notes shown internally." />
        </label>

        <button type="submit">Create Invoice</button>
      </form>
    </section>
  );
}
