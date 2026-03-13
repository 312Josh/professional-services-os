import Link from "next/link";
import { getActivityTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ActivityPage() {
  const activities = await prisma.activity.findMany({
    include: { lead: true, customer: true, job: true, invoice: true, admin: true },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  return (
    <section className="card">
      <h1>Notes & Activity</h1>
      <p className="muted">Audit trail of status changes, conversions, notes, and mock emails.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Type</th>
              <th>Message</th>
              <th>Links</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{formatDate(activity.createdAt)}</td>
                <td>{getActivityTypeLabel(activity.type)}</td>
                <td>{activity.message}</td>
                <td>
                  <div className="row-actions">
                    {activity.customerId ? (
                      <Link href={`/customers/${activity.customerId}`}>Customer</Link>
                    ) : null}
                    {activity.invoiceId ? <Link href={`/invoices/${activity.invoiceId}`}>Invoice</Link> : null}
                  </div>
                </td>
                <td>{activity.admin?.name || "system"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
