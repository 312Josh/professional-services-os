"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, ChevronDown, Phone, MessageSquare, Mail } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  service: string;
  status: string;
  createdAt: string;
  minutesAgo: number;
};

type CadenceStep = {
  action: "text" | "call" | "email";
  label: string;
  delayMin: number;
  status: "sent" | "pending" | "failed" | "skipped";
  firedAt?: string;
};

function simulateCadence(minutesAgo: number, status: string): CadenceStep[] {
  const steps: CadenceStep[] = [
    { action: "text", label: "Auto-text to customer", delayMin: 0, status: "pending" },
    { action: "call", label: "Owner notification", delayMin: 0, status: "pending" },
    { action: "email", label: "Email alert to owner", delayMin: 0, status: "pending" },
    { action: "text", label: "Second alert (if no response)", delayMin: 5, status: "pending" },
    { action: "email", label: "Missed lead warning", delayMin: 15, status: "pending" },
  ];

  if (status === "disqualified") {
    return steps.map((s) => ({ ...s, status: "skipped" as const }));
  }

  return steps.map((step) => {
    if (minutesAgo >= step.delayMin) {
      return { ...step, status: "sent" as const, firedAt: `${step.delayMin === 0 ? "<1" : step.delayMin} min after submission` };
    }
    return step;
  });
}

const ACTION_ICONS = { text: MessageSquare, call: Phone, email: Mail };
const STATUS_STYLES = {
  sent: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", label: "Sent" },
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Failed" },
  skipped: { icon: XCircle, color: "text-slate-400", bg: "bg-slate-50", label: "Skipped" },
};

const FILTERS = ["all", "in-cadence", "completed", "failed"] as const;

export function LeadCadenceTracker({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = leads.filter((lead) => {
    if (filter === "all") return true;
    const steps = simulateCadence(lead.minutesAgo, lead.status);
    const allSent = steps.every((s) => s.status === "sent" || s.status === "skipped");
    const anyFailed = steps.some((s) => s.status === "failed");
    if (filter === "completed") return allSent;
    if (filter === "failed") return anyFailed;
    if (filter === "in-cadence") return !allSent && !anyFailed;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 lg:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">Lead Cadence Tracker</h2>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} leads · click to see cadence steps</p>
        </div>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "in-cadence" ? "In Cadence" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filtered.map((lead) => {
          const steps = simulateCadence(lead.minutesAgo, lead.status);
          const sentCount = steps.filter((s) => s.status === "sent").length;
          const isExpanded = expandedId === lead.id;

          return (
            <div key={lead.id}>
              <div
                className={`px-5 lg:px-6 py-3.5 flex items-center gap-4 cursor-pointer transition-colors ${isExpanded ? "bg-blue-50/40" : "hover:bg-slate-50"}`}
                onClick={() => setExpandedId(isExpanded ? null : lead.id)}
              >
                {/* Progress indicator */}
                <div className="flex gap-0.5 flex-shrink-0">
                  {steps.map((step, i) => {
                    const s = STATUS_STYLES[step.status];
                    return <div key={i} className={`w-2 h-2 rounded-full ${step.status === "sent" ? "bg-emerald-500" : step.status === "failed" ? "bg-red-500" : "bg-slate-200"}`} />;
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-[13px]">{lead.name}</p>
                  <p className="text-[11px] text-slate-400">{lead.service} · {lead.createdAt}</p>
                </div>

                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">{sentCount}/{steps.length} steps sent</span>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>

              {/* Expanded cadence steps */}
              {isExpanded && (
                <div className="px-5 lg:px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                  <div className="space-y-3 ml-4">
                    {steps.map((step, i) => {
                      const s = STATUS_STYLES[step.status];
                      const ActionIcon = ACTION_ICONS[step.action];
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full ${s.bg} flex items-center justify-center flex-shrink-0`}>
                            <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <ActionIcon className="w-3 h-3 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">{step.label}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {step.firedAt || `Fires at +${step.delayMin}m`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">No leads match this filter</div>
      )}
    </div>
  );
}
