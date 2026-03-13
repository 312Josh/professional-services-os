import Link from "next/link";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: {
        select: {
          jobs: true,
          invoices: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>Customers</h1>
        <form method="post" action="/api/customers" className="grid three">
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
          <button type="submit">Create Customer</button>
        </form>
      </section>

      <section className="card">
        <h2>Customer Database</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Jobs</th>
                <th>Invoices</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <div className="muted">{formatDate(customer.createdAt)}</div>
                  </td>
                  <td>
                    <div>{customer.phone || "-"}</div>
                    <div className="muted">{customer.email || "-"}</div>
                  </td>
                  <td>{customer.address || "-"}</td>
                  <td>{customer._count.jobs}</td>
                  <td>{customer._count.invoices}</td>
                  <td>
                    <Link href={`/customers/${customer.id}`}>Open record</Link>
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
