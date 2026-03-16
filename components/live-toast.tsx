"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATIONS = [
  { icon: "🔔", text: "New inquiry from Maria S. — Family Law", time: "30 seconds ago" },
  { icon: "✅", text: "Responded to James W. — 8 min response time", time: "3 minutes ago" },
  { icon: "⭐", text: "New 5-star review from Linda C.", time: "10 minutes ago" },
  { icon: "📅", text: "Consultation confirmed — Robert K. — Tomorrow 10am", time: "15 minutes ago" },
  { icon: "🔔", text: "New inquiry from Angela T. — Real Estate", time: "22 minutes ago" },
  { icon: "✅", text: "Responded to David P. — 6 min response time", time: "30 minutes ago" },
];

export function LiveToast() {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const first = setTimeout(() => setShow(true), 8000);
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % NOTIFICATIONS.length);
        setShow(true);
      }, 500);
    }, 12000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(t);
    }
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
          onClick={() => setShow(false)}
        >
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl shadow-black/10 flex items-start gap-3 cursor-pointer">
            <span className="text-xl flex-shrink-0 mt-0.5">{notif.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 leading-snug">{notif.text}</p>
              <p className="text-xs text-slate-400 mt-0.5">{notif.time}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
