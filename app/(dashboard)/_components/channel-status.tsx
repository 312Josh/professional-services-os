"use client";

import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";

type Channel = {
  icon: React.ElementType;
  name: string;
  label: string;
  status: "active" | "configured" | "disconnected";
};

const CHANNELS: Channel[] = [
  { icon: MessageSquare, name: "SMS", label: "Google Voice", status: "active" },
  { icon: Mail, name: "Email", label: "Resend", status: "active" },
  { icon: Phone, name: "Call Routing", label: "Forwarding", status: "configured" },
  { icon: Calendar, name: "Booking", label: "Cal.com", status: "active" },
];

const STATUS_STYLES = {
  active: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Active" },
  configured: { dot: "bg-amber-500", text: "text-amber-600", label: "Needs verification" },
  disconnected: { dot: "bg-red-500", text: "text-red-600", label: "Disconnected" },
};

export function ChannelStatusBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-slate-800 border-t border-white/5 text-[11px]">
      <span className="text-slate-500 font-medium uppercase tracking-wider mr-1">Channels</span>
      {CHANNELS.map((ch) => {
        const s = STATUS_STYLES[ch.status];
        return (
          <div key={ch.name} className="flex items-center gap-1.5 text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <ch.icon className="w-3 h-3" />
            <span>{ch.name}</span>
          </div>
        );
      })}
    </div>
  );
}
