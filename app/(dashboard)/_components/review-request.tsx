"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

type ReviewRequestProps = {
  jobId: string;
  jobTitle: string;
  customerName: string;
  customerPhone: string | null;
};

export function ReviewRequestButton({ jobId, jobTitle, customerName, customerPhone }: ReviewRequestProps) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const defaultMessage = `Hi ${customerName}, it was great working with you on your ${jobTitle}! Would you take 30 seconds to leave us a review? It helps other homeowners find reliable service. Thank you! — Apex Plumbing`;

  const handleSend = () => {
    setSending(true);
    // Simulate sending (in production, this would call an API)
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700"
      >
        <CheckCircle2 className="w-4 h-4" />
        Review request sent to {customerName}
      </motion.div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-4 h-4 text-amber-600" />
        <h4 className="text-sm font-semibold text-amber-800">Request a Review</h4>
      </div>
      <p className="text-xs text-amber-700 mb-3">
        Job complete — send {customerName} a review request?
      </p>
      <div className="bg-white border border-amber-200 rounded-lg p-3 mb-3 text-xs text-slate-600 italic">
        &ldquo;{defaultMessage}&rdquo;
      </div>
      <div className="flex gap-2">
        {customerPhone && (
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {sending ? (
              <span className="animate-spin w-3 h-3 border-2 border-slate-900/20 border-t-slate-900 rounded-full" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
            {sending ? "Sending..." : "Send via SMS"}
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-200 text-amber-700 font-semibold text-xs rounded-lg hover:bg-amber-50 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          {sending ? "Sending..." : "Send via Email"}
        </button>
      </div>
    </div>
  );
}
