"use client";

import { useState } from "react";
import { Zap, MessageSquare, Bell, Mail, Clock, AlertTriangle, PhoneMissed, CheckCircle2, ChevronDown } from "lucide-react";

type CadenceStep = {
  time: string;
  icon: React.ElementType;
  title: string;
  description: string;
  message?: string;
  editable?: boolean;
  color: string;
};

const FORM_CADENCE: CadenceStep[] = [
  { time: "0s", icon: CheckCircle2, title: "Form Confirmation", description: "Customer sees confirmation page with callback promise.", color: "emerald" },
  { time: "15s", icon: MessageSquare, title: "Auto-Text to Customer", description: "Instant text message to the customer's phone.", message: "Thanks for reaching out to Apex Plumbing! We got your message and will call you within 5 minutes. — The Apex Team", editable: true, color: "blue" },
  { time: "15s", icon: Bell, title: "Push Notification to Owner", description: "Instant push alert on your phone with lead details.", color: "amber" },
  { time: "15s", icon: Mail, title: "Email Alert to Owner", description: "Full lead details sent to your email inbox.", color: "amber" },
  { time: "30s", icon: Clock, title: "Lead on Dashboard", description: "Lead appears on your dashboard with a live response timer ticking.", color: "blue" },
  { time: "5m", icon: AlertTriangle, title: "Second Alert", description: "If you haven't responded — second notification fires.", color: "amber" },
  { time: "15m", icon: AlertTriangle, title: "Missed Lead Warning", description: "Lead flagged as 'Response Late' with revenue-at-risk estimate.", color: "red" },
];

const MISSED_CALL_CADENCE: CadenceStep[] = [
  { time: "0s", icon: PhoneMissed, title: "Missed Call Detected", description: "System detects the missed call and logs it.", color: "red" },
  { time: "10s", icon: MessageSquare, title: "Auto-Text to Caller", description: "Instant text to the caller.", message: "Sorry we missed your call! A team member will call you back within 5 minutes. — Apex Plumbing", editable: true, color: "blue" },
  { time: "10s", icon: Mail, title: "Email Alert to Owner", description: "Missed call details sent to your email.", color: "amber" },
  { time: "15s", icon: Clock, title: "Logged on Dashboard", description: "Missed call appears as a new lead with urgency flag.", color: "blue" },
];

function TimelineDot({ color }: { color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500 ring-emerald-100",
    blue: "bg-blue-500 ring-blue-100",
    amber: "bg-amber-500 ring-amber-100",
    red: "bg-red-500 ring-red-100",
  };
  return (
    <div className={`w-3 h-3 rounded-full ring-4 ${colors[color] || colors.blue} flex-shrink-0`} />
  );
}

function StepCard({ step }: { step: CadenceStep }) {
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState(step.message || "");

  return (
    <div className="flex gap-4 items-start">
      {/* Time label */}
      <div className="w-10 text-right flex-shrink-0 pt-0.5">
        <span className="text-[11px] font-mono font-bold text-slate-400">{step.time}</span>
      </div>

      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1.5">
        <TimelineDot color={step.color} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <step.icon className={`w-4 h-4 text-${step.color}-500`} />
          <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed">{step.description}</p>
        {step.message && (
          <div className="mt-2">
            {editing ? (
              <div className="space-y-2">
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="text-xs px-3 py-1.5 bg-amber-500 text-slate-900 font-semibold rounded-md cursor-pointer">Save</button>
                  <button onClick={() => { setMsg(step.message!); setEditing(false); }} className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md cursor-pointer">Cancel</button>
                </div>
              </div>
            ) : (
              <div
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-600 italic cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-colors group"
                onClick={() => step.editable && setEditing(true)}
              >
                &ldquo;{msg}&rdquo;
                {step.editable && (
                  <span className="text-[10px] text-slate-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">click to edit</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResponseCadencePanel() {
  const [showMissed, setShowMissed] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-5 h-5 text-amber-500" />
        <h2 className="font-display text-lg font-bold text-slate-900">Lead Response Automation</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">Here&apos;s exactly what happens when someone contacts your business.</p>

      {/* Form submission cadence */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-[10px]">📋</span>
          When someone submits a form
        </h3>
        <div className="border-l-2 border-slate-100 ml-[3.25rem]">
          <div className="-ml-[calc(3.25rem+1px)]">
            {FORM_CADENCE.map((step, i) => (
              <StepCard key={i} step={step} />
            ))}
          </div>
        </div>
      </div>

      {/* Missed call cadence */}
      <button
        onClick={() => setShowMissed(!showMissed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <PhoneMissed className="w-4 h-4" />
          When a call is missed
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showMissed ? "rotate-180" : ""}`} />
      </button>

      {showMissed && (
        <div className="mt-4 border-l-2 border-red-100 ml-[3.25rem]">
          <div className="-ml-[calc(3.25rem+1px)]">
            {MISSED_CALL_CADENCE.map((step, i) => (
              <StepCard key={i} step={step} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
