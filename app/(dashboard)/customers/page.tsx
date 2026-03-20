export const dynamic = "force-dynamic";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Users, ArrowRight } from "lucide-react";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Create Customer Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-slate-400" />
          <h1 className="font-display text-lg font-bold text-slate-900">Customers</h1>
        </div>

        <form method="post" action="/api/customers">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name *</label>
              <input name="name" required placeholder="Customer name" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
              <input name="phone" placeholder="Phone number" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input name="email" type="email" placeholder="Email address" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
              <input name="address" placeholder="Service address" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer">
              Create Customer
            </button>
          </div>
        </form>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 lg:px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-bold text-slate-900">Customer Database</h2>
          <p className="text-xs text-slate-400 mt-0.5">{customers.length} customers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 pl-5 lg:pl-6 pr-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Contact</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Address</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Jobs</th>
                <th className="text-right py-3 pr-5 lg:pr-6 pl-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pl-5 lg:pl-6 pr-3">
                    <p className="font-semibold text-slate-900 text-[13px]">{customer.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(customer.createdAt)}</p>
                  </td>
                  <td className="py-3 px-3">
                    {customer.phone && <p className="text-slate-700 text-[13px]">{customer.phone}</p>}
                    {customer.email && <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{customer.email}</p>}
                    {!customer.phone && !customer.email && <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[13px] hidden sm:table-cell">{customer.address || "—"}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{customer._count.jobs}</span>
                  </td>
                  <td className="py-3 pr-5 lg:pr-6 pl-3 text-right">
                    <Link href={`/customers/${customer.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
                      Open <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
