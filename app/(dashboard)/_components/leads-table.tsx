"use client";

import { useState } from "react";
import { ChevronDown, Phone, Mail, UserPlus, Briefcase, MessageSquare, X } from "lucide-react";

type LeadRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  serviceRequested: string | null;
  status: string;
  statusLabel: string;
  convertedCustomerId: string | null;
  convertedCustomerName: string | null;
  createdAt: string;
  signalLabel: string;
  signalColor: string;
  age: string;
  rowBg: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "disqualified", label: "Disqualified" },
];

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 lg:px-6 py-4 border-b border-slate-100">
        <h2 className="font-display text-lg font-bold text-slate-900">All Leads</h2>
        <p className="text-xs text-slate-400 mt-0.5">{leads.length} total · click a row to expand</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="text-left py-3 pl-5 lg:pl-6 pr-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Contact</th>
              <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Service</th>
              <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider hidden md:table-cell">Signal</th>
              <th className="text-center py-3 pr-5 lg:pr-6 pl-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-10"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isExpanded = expandedId === lead.id;
              return (
                <LeadRowWithDetail
                  key={lead.id}
                  lead={lead}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedId(isExpanded ? null : lead.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">No leads yet</div>
      )}
    </div>
  );
}

function LeadRowWithDetail({ lead, isExpanded, onToggle }: { lead: LeadRow; isExpanded: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Compact row */}
      <tr
        className={`border-b border-slate-100 cursor-pointer transition-colors ${isExpanded ? "bg-blue-50/40" : `hover:bg-slate-50 ${lead.rowBg}`}`}
        onClick={onToggle}
      >
        <td className="py-3 pl-5 lg:pl-6 pr-3">
          <p className="font-semibold text-slate-900 text-[13px]">{lead.name}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lead.createdAt}</p>
        </td>
        <td className="py-3 px-3">
          {lead.phone && (
            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-slate-700 hover:text-blue-600 transition-colors text-[13px] flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" /> {lead.phone}
            </a>
          )}
          {lead.email && <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{lead.email}</p>}
        </td>
        <td className="py-3 px-3 text-slate-600 text-[13px] hidden sm:table-cell">{lead.serviceRequested || "—"}</td>
        <td className="py-3 px-3">
          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
            {lead.statusLabel}
          </span>
        </td>
        <td className="py-3 px-3 hidden md:table-cell">
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${lead.signalColor}`}>
            {lead.signalLabel}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">{lead.age}</p>
        </td>
        <td className="py-3 pr-5 lg:pr-6 pl-3 text-center">
          <ChevronDown className={`w-4 h-4 text-slate-400 mx-auto transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </td>
      </tr>

      {/* Expanded detail panel */}
      {isExpanded && (
        <tr>
          <td colSpan={6} className="bg-slate-50/50 border-b border-slate-200">
            <div className="px-5 lg:px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-slate-900">{lead.name}</h3>
                <button onClick={onToggle} className="w-7 h-7 rounded-md hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Quick actions */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-slate-700">
                      <Phone className="w-4 h-4 text-blue-500" /> Call {lead.phone}
                    </a>
                  )}
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-slate-700">
                      <Mail className="w-4 h-4 text-blue-500" /> Email {lead.email}
                    </a>
                  )}
                </div>

                {/* Status update */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Update Status</p>
                  <form method="post" action={`/api/leads/${lead.id}/status`} className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <select name="status" defaultValue={lead.status} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40">
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <input name="disqualifyReason" placeholder="Reason (if disqualifying)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40" />
                    <button type="submit" className="w-full px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                      Update
                    </button>
                  </form>
                </div>

                {/* Convert / Notes */}
                <div className="space-y-3">
                  {!lead.convertedCustomerId ? (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Convert</p>
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <form method="post" action={`/api/leads/${lead.id}/convert`}>
                          <button type="submit" className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                            <UserPlus className="w-4 h-4" /> Convert to Customer
                          </button>
                        </form>
                        <form method="post" action={`/api/leads/${lead.id}/convert`}>
                          <input type="hidden" name="bookJob" value="1" />
                          <button type="submit" className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                            <Briefcase className="w-4 h-4" /> Convert & Book Job
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer</p>
                      <a href={`/customers/${lead.convertedCustomerId}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium">
                        👤 {lead.convertedCustomerName}
                      </a>
                    </div>
                  )}

                  <div onClick={(e) => e.stopPropagation()}>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Add Note</p>
                    <form method="post" action={`/api/leads/${lead.id}/notes`} className="flex gap-2">
                      <input name="note" required placeholder="Quick note..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40" />
                      <button type="submit" className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-lg transition-colors cursor-pointer">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
