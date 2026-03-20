import { getJobStatusLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserCircle, Phone, Mail, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      activities: { where: { type: "note" }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!customer) notFound();

  const statusColor: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Customer Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-slate-900">{customer.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {customer.phone}
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {customer.email}
                </a>
              )}
              {customer.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {customer.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Note */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-display text-base font-bold text-slate-900 mb-3">Add Note</h2>
          <form method="post" action={`/api/customers/${customer.id}/notes`}>
            <textarea name="note" required placeholder="Customer note..." rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white resize-y min-h-[80px] mb-3" />
            <div className="flex justify-end">
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer">Save Note</button>
            </div>
          </form>
        </div>

        {/* Create Job */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-display text-base font-bold text-slate-900 mb-3">Create Job</h2>
          <form method="post" action={`/api/customers/${customer.id}/jobs`}>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
                <input name="title" required placeholder="Service call" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Date</label>
                <input name="serviceDate" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea name="description" rows={2} placeholder="Job details..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white resize-y" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer">Create Job</button>
            </div>
          </form>
        </div>
      </div>

      {/* Jobs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-display text-base font-bold text-slate-900">Jobs ({customer.jobs.length})</h2>
        </div>
        {customer.jobs.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-2.5 pl-5 pr-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Title</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {customer.jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pl-5 pr-3 font-medium text-slate-900 text-[13px]">{job.title}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[job.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>{getJobStatusLabel(job.status)}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[13px] hidden sm:table-cell">{formatDate(job.serviceDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-6 text-sm text-slate-400 text-center">No jobs yet</p>
        )}
      </div>

      {/* Recent Notes */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-display text-base font-bold text-slate-900">Recent Notes</h2>
        </div>
        {customer.activities.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {customer.activities.map((activity) => (
              <div key={activity.id} className="px-5 py-3 text-sm">
                <p className="text-slate-700">{activity.message}</p>
                <p className="text-[11px] text-slate-400 mt-1">{formatDate(activity.createdAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-slate-400 text-center">No notes yet</p>
        )}
      </div>
    </div>
  );
}
