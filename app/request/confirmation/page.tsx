"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone, Clock, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BRAND = { name: "Mitchell & Associates", phone: "(312) 555-0199", responseMin: 10 };

export default function ConfirmationPage() {
  return (
    <div className="grain min-h-screen bg-slate-50">
      <div className="bg-[#0f1f35] text-white py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-display font-bold text-lg">{BRAND.name}</span>
          <a href={`tel:${BRAND.phone}`} className="text-amber-300 font-semibold text-sm flex items-center gap-1"><Phone className="w-4 h-4" /> {BRAND.phone}</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="border-emerald-200 shadow-lg shadow-emerald-500/5">
            <CardContent className="pt-10 pb-8 px-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
              </motion.div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0f1f35] tracking-tight">Consultation Request Received</h1>
              <p className="mt-4 text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
                An attorney will contact you within <strong className="text-[#0f1f35]">{BRAND.responseMin} minutes</strong>.
              </p>

              <div className="mt-8 space-y-4 text-left max-w-sm mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5"><MessageSquare className="w-4 h-4 text-blue-600" /></div>
                  <div><p className="font-semibold text-sm text-[#0f1f35]">Confirmation sent</p><p className="text-sm text-slate-400">Check your phone for a text confirmation.</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5"><Phone className="w-4 h-4 text-blue-600" /></div>
                  <div><p className="font-semibold text-sm text-[#0f1f35]">Attorney callback</p><p className="text-sm text-slate-400">An attorney will call within {BRAND.responseMin} minutes to discuss your case.</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5"><Shield className="w-4 h-4 text-blue-600" /></div>
                  <div><p className="font-semibold text-sm text-[#0f1f35]">100% confidential</p><p className="text-sm text-slate-400">Attorney-client privilege applies from this moment.</p></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-slate-400 text-sm mb-3">Need immediate help?</p>
                <Button asChild className="bg-amber-500 hover:bg-amber-400 text-[#0f1f35] font-bold rounded-full px-8 h-12 shadow-lg shadow-amber-500/20">
                  <a href={`tel:${BRAND.phone}`}><Phone className="w-4 h-4 mr-2" /> Call {BRAND.phone}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.5 }} className="mt-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"><MessageSquare className="w-4 h-4 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Automated text sent just now</p>
              <p className="text-sm text-slate-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3 leading-relaxed">
                &ldquo;Thank you for contacting {BRAND.name}. An attorney will call you within {BRAND.responseMin} minutes. All communications are confidential.&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
