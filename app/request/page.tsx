"use client";

import { motion } from "framer-motion";
import { Phone, Clock, Shield, Scale, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BRAND = { name: "Heritage Elder Law Group", phone: "(781) 444-8811", responseMin: 10 };
const AREAS = ["Elder Law & Medicaid Planning", "Estate Planning & Trusts", "Probate & Estate Administration", "Guardianship & Conservatorship", "Long-Term Care Planning", "Veterans Benefits", "Other"];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) } as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } } as const;

export default function RequestPage() {
  return (
    <div className="grain min-h-screen bg-slate-50">
      <div className="bg-[#0f1f35] text-white py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-display font-bold text-lg">{BRAND.name}</span>
          <a href={`tel:${BRAND.phone}`} className="text-amber-300 font-semibold text-sm flex items-center gap-1"><Phone className="w-4 h-4" /> {BRAND.phone}</a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div custom={0} variants={fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Clock className="w-4 h-4" /> We respond within {BRAND.responseMin} minutes
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0f1f35] tracking-tight">Schedule a Consultation</h1>
            <p className="text-slate-500 mt-2 text-lg">Tell us about your situation. Your initial consultation is free.</p>
          </motion.div>

          <motion.div custom={1} variants={fadeUp}>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-8 pb-6 px-6 sm:px-8">
                <form method="post" action="/api/intake" className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#0f1f35] mb-1.5">Your Name *</label>
                      <input name="name" required placeholder="Jane Smith" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f1f35] mb-1.5">Phone Number *</label>
                      <input name="phone" type="tel" required placeholder="(312) 555-0100" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f1f35] mb-1.5">Email (optional)</label>
                    <input name="email" type="email" placeholder="jane@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f1f35] mb-1.5">Practice Area *</label>
                    <select name="service" required className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all bg-white">
                      <option value="">Select a practice area...</option>
                      {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f1f35] mb-1.5">Briefly describe your situation (optional)</label>
                    <textarea name="message" rows={3} placeholder="Help us understand your needs so we can prepare for your consultation..." className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all resize-none" />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-amber-500 hover:bg-amber-400 text-[#0f1f35] font-bold text-base h-14 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.01] transition-all">
                    Submit — Get a Response in {BRAND.responseMin} Minutes
                  </Button>
                </form>
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5" /> Bar Admitted</span>
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> NAELA Member</span>
                  <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Confidential</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.p custom={2} variants={fadeUp} className="text-center text-slate-400 text-sm mt-6">
            Or call: <a href={`tel:${BRAND.phone}`} className="text-[#1e3a5f] font-semibold hover:text-blue-600">{BRAND.phone}</a> — consultations available 7 days a week
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
