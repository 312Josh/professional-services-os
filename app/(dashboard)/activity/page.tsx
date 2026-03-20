export const dynamic = "force-dynamic";
import Link from "next/link";
import { appConfig } from "@/lib/app-config";
import { getActivityTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Clock, ArrowRight } from "lucide-react";

export default async function ActivityPage() {
  const activities = await prisma.activity.findMany({
    where: { invoiceId: null },
    include: { lead: true, customer: true, job: true, admin: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const typeColor: Record<string, string> = {
    lead_created: "bg-blue-50 text-blue-700 border-blue-200",
    lead_contacted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    note: "bg-slate-50 text-slate-600 border-slate-200",
    status_change: "bg-violet-50 text-violet-700 border-violet-200",
    sms_reply: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 lg:px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900">Activity Log</h1>
              <p className="text-xs text-slate-400 mt-0.5">{appConfig.copy.activitySubtitle}</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div key={activity.id} className="px-5 lg:px-6 py-3 hover:bg-slate-50/50 transition-colors flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeColor[activity.type] || typeColor.note}`}>
                  {getActivityTypeLabel(activity.type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-slate-700">{activity.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-slate-400">{formatDate(activity.createdAt)}</span>
                  <span className="text-[11px] text-slate-400">by {activity.admin?.name || "system"}</span>
                  {activity.leadId && (
                    <Link href={`/leads`} className="text-[11px] text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center gap-0.5">
                      Lead{activity.lead ? `: ${activity.lead.name}` : ""} <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                  {activity.customerId && (
                    <Link href={`/customers/${activity.customerId}`} className="text-[11px] text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center gap-0.5">
                      {activity.customer ? activity.customer.name : "Customer"} <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                  {activity.jobId && (
                    <Link href={`/jobs`} className="text-[11px] text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center gap-0.5">
                      {activity.job ? activity.job.title : "Job"} <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No activity recorded yet</div>
        )}
      </div>
    </div>
  );
}
