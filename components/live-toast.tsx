"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NOTIFICATIONS = [
  { icon: "🔔", text: "New lead from Sarah M. — Emergency Plumbing", time: "30 seconds ago" },
  { icon: "✅", text: "Responded to Mike T. — 4 min response time", time: "2 minutes ago" },
  { icon: "⭐", text: "New 5-star review from Jennifer R.", time: "5 minutes ago" },
  { icon: "📅", text: "Booking confirmed — David K. — Tomorrow 2pm", time: "8 minutes ago" },
  { icon: "🔔", text: "New lead from Angela T. — HVAC Repair", time: "12 minutes ago" },
  { icon: "✅", text: "Responded to Lisa P. — 3 min response time", time: "15 minutes ago" },
];

export function LiveToast() {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);

  const dismiss = useCallback(() => setShow(false), []);

  useEffect(() => {
    // Show first notification after 8 seconds
    const first = setTimeout(() => setShow(true), 8000);
    // Rotate every 15 seconds
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % NOTIFICATIONS.length);
        setShow(true);
      }, 600);
    }, 15000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, [show, idx]);

  const notif = NOTIFICATIONS[idx];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-5 right-5 z-50 max-w-sm"
        >
          <div className="bg-white border border-slate-200 rounded-xl pl-4 pr-2 py-3 shadow-xl shadow-black/10 flex items-start gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">{notif.icon}</span>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-sm font-semibold text-slate-800 leading-snug">{notif.text}</p>
              <p className="text-xs text-slate-400 mt-0.5">{notif.time}</p>
            </div>
            <button
              onClick={dismiss}
              className="flex-shrink-0 w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
