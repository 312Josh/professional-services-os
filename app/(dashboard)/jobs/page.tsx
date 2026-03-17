export const dynamic = "force-dynamic";
import { getJobStatusLabel, JOB_SOURCE_LEAD_STATUSES, JOB_STATUSES, JOB_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Briefcase, ArrowRight } from "lucide-react";

export default async function JobsPage() {
  const [jobs, customers, leads] = await Promise.all([
    prisma.job.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } }),
    prisma.customer.findMany({ orderBy: { name: "asc" } }),
    prisma.lead.findMany({ where: { status: { in: [...JOB_SOURCE_LEAD_STATUSES] } }, orderBy: { createdAt: "desc" } }),
  ]);

  const statusColor: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Create Job Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-slate-400" />
          <h1 className="font-display text-lg font-bold text-slate-900">Jobs</h1>
        </div>

        <form method="post" action="/api/jobs">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
              <input name="title" required placeholder="Job title" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer *</label>
              <select name="customerId" required defaultValue="" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                <option value="" disabled>Select customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Source Lead (optional)</label>
              <select name="leadId" defaultValue="" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white">
                <option value="">No lead</option>
                {leads.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Date</label>
              <input name="serviceDate" type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white" />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea name="description" rows={4} placeholder="Job details, scope of work, special instructions..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white resize-y min-h-[120px]" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer">
              Create Job
            </button>
          </div>
        </form>
      </div>

      {/* Job Board */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 lg:px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-bold text-slate-900">Job Board</h2>
          <p className="text-xs text-slate-400 mt-0.5">{jobs.length} jobs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 pl-5 lg:pl-6 pr-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Title</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right py-3 pr-5 lg:pr-6 pl-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pl-5 lg:pl-6 pr-3">
                    <p className="font-semibold text-slate-900 text-[13px]">{job.title}</p>
                    {job.description && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{job.description}</p>}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[13px]">{job.customer.name}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[job.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {getJobStatusLabel(job.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[13px] hidden sm:table-cell">{formatDate(job.serviceDate)}</td>
                  <td className="py-3 pr-5 lg:pr-6 pl-3 text-right">
                    <form method="post" action={`/api/jobs/${job.id}/status`} className="inline-flex items-center gap-1.5">
                      <select name="status" defaultValue={job.status} className="px-2 py-1 border border-slate-200 rounded-md text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-amber-400/40">
                        {JOB_STATUSES.map((s) => <option key={s} value={s}>{JOB_STATUS_LABELS[s]}</option>)}
                      </select>
                      <button type="submit" className="w-7 h-7 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-colors text-[11px] cursor-pointer" title="Update">✓</button>
                    </form>
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
