export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Zap } from "lucide-react";
import { ResponseCadencePanel } from "@/app/(dashboard)/_components/response-cadence";
import { LeadCadenceTracker } from "@/app/(dashboard)/_components/lead-cadence-tracker";

export default async function LeadResponsePage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-amber-500" />
          <h1 className="font-display text-lg font-bold text-slate-900">Lead Response Automation</h1>
        </div>
        <p className="text-sm text-slate-500">See exactly what happens when someone contacts your business — and track every lead through the response cadence.</p>
      </div>

      {/* Cadence configuration */}
      <ResponseCadencePanel />

      {/* Active lead tracking */}
      <LeadCadenceTracker leads={leads.map((l) => ({
        id: l.id,
        name: l.name,
        service: l.serviceRequested || "General",
        status: l.status,
        createdAt: formatDate(l.createdAt),
        minutesAgo: Math.floor((Date.now() - new Date(l.createdAt).getTime()) / 60000),
      }))} />
    </div>
  );
}
