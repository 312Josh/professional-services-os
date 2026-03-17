"use client";

import { Zap, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

type SpeedHeroProps = {
  avgResponseMinutes: number;
  avgResponseSeconds: number;
  todayResponseRate: number;
  missedLeadsToday: number;
  leadsReceivedToday: number;
  leadsRespondedToday: number;
};

function getStatusColor(avgMin: number): { bg: string; text: string; border: string; label: string } {
  if (avgMin < 10) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Excellent" };
  if (avgMin < 60) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Needs improvement" };
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Critical" };
}

export function SpeedToLeadHero(props: SpeedHeroProps) {
  const { avgResponseMinutes, avgResponseSeconds, todayResponseRate, missedLeadsToday, leadsReceivedToday, leadsRespondedToday } = props;
  const status = getStatusColor(avgResponseMinutes);

  return (
    <div className={`${status.bg} border ${status.border} rounded-xl p-5 lg:p-6 mb-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className={`w-5 h-5 ${status.text}`} />
        <h2 className={`font-display text-sm font-bold uppercase tracking-wider ${status.text}`}>Speed-to-Lead Performance</h2>
        <span className={`ml-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${status.bg} ${status.text} border ${status.border}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avg Response Time */}
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Avg Response</p>
          <p className="font-display text-3xl lg:text-4xl font-bold text-slate-900 leading-none">
            {avgResponseMinutes}<span className="text-lg text-slate-400 ml-0.5">m</span>
            <span className="text-lg text-slate-900 ml-1">{avgResponseSeconds}</span><span className="text-lg text-slate-400 ml-0.5">s</span>
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] text-emerald-600 font-medium">Faster than 94% of businesses</span>
          </div>
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Response Rate</p>
          <p className="font-display text-3xl lg:text-4xl font-bold text-slate-900 leading-none">
            {todayResponseRate}<span className="text-lg text-slate-400">%</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-2">{leadsRespondedToday}/{leadsReceivedToday} leads responded today</p>
        </div>

        {/* Leads Today */}
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Leads Today</p>
          <p className="font-display text-3xl lg:text-4xl font-bold text-slate-900 leading-none">
            {leadsReceivedToday}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] text-emerald-600 font-medium">{leadsRespondedToday} responded</span>
          </div>
        </div>

        {/* Missed Leads */}
        <div className={`bg-white rounded-xl p-4 border ${missedLeadsToday > 0 ? "border-red-200" : "border-slate-100"}`}>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Missed Leads</p>
          <p className={`font-display text-3xl lg:text-4xl font-bold leading-none ${missedLeadsToday > 0 ? "text-red-600" : "text-slate-900"}`}>
            {missedLeadsToday}
          </p>
          {missedLeadsToday > 0 ? (
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span className="text-[11px] text-red-600 font-medium">Needs attention</span>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-600 font-medium mt-2">✓ No missed leads</p>
          )}
        </div>
      </div>
    </div>
  );
}
