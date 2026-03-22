"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Clock, Shield, Star, Zap, Scale, BookOpen, Briefcase, Users, Gavel, Home, ArrowRight, MapPin, Award, TrendingDown, MessageSquare, CalendarCheck, BarChart3, ChevronRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LiveToast } from "@/components/live-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookingModal } from "@/components/booking-modal";
import { getBrand } from "@/lib/brand-client";

// BRAND is now read from NEXT_PUBLIC_ env vars (generated from white-label.config.json)
// Fallbacks are in getBrand() for safety

const PRACTICE_AREAS = [
  { name: "Elder Law & Medicaid Planning", icon: Users },
  { name: "Estate Planning", icon: BookOpen },
  { name: "Probate & Estate Administration", icon: Briefcase },
  { name: "Long-Term Care Planning", icon: Shield },
  { name: "Veterans Benefits", icon: Home },
  { name: "Guardianship & Conservatorship", icon: Gavel },
];

const REVIEWS = [
  { name: "Maria S.", service: "Elder Law & Medicaid Planning", text: "I was going through a difficult divorce and needed an attorney fast. They responded within 10 minutes and made me feel heard from the first call.", rating: 5, date: "1 month ago" },
  { name: "James W.", service: "Estate Planning", text: "Set up our family trust and estate plan. Thorough, patient, and explained everything in plain English. Exactly what we needed.", rating: 5, date: "3 weeks ago" },
  { name: "Linda C.", service: "Probate & Estate Administration", text: "Handled our business incorporation and operating agreement. Professional, responsive, and finished ahead of schedule.", rating: 5, date: "2 months ago" },
  { name: "Robert K.", service: "Long-Term Care Planning", text: "After my accident, I didn't know where to turn. They took my case on contingency and got me a settlement I never expected.", rating: 5, date: "1 month ago" },
  { name: "Angela T.", service: "Veterans Benefits", text: "Closed on our first home with zero stress. They caught issues the seller's attorney missed. Worth every penny.", rating: 4, date: "6 weeks ago" },
];

const TRUST_ITEMS = [
  { icon: Scale, label: "Bar Admitted", desc: "Experienced elder law counsel serving Needham and Greater Boston families." },
  { icon: Award, label: "NAELA Member", desc: "National Academy of Elder Law Attorneys member." },
  { icon: Star, label: "Super Lawyers", desc: "Recognized by Super Lawyers for excellence." },
  { icon: Shield, label: "5-Star Reviews", desc: "Trusted by families for thoughtful, compassionate guidance." },
  { icon: MessageSquare, label: "Free Consultation", desc: "Free initial consultation for families planning their next step." },
  { icon: Lock, label: "Confidential", desc: "Confidential conversations from your first call." },
];

const SOLUTION_STEPS = [
  { icon: Zap, num: "01", title: "Free Consultation", body: "Start with a calm, confidential conversation about your family's situation, concerns, and goals." },
  { icon: MessageSquare, num: "02", title: "Custom Plan", body: "If your team doesn't answer, the system sends a response within 60 seconds: \"Thank you for contacting Heritage Elder Law Group. An attorney will call you within 10 minutes.\" That text alone saves 40% of inquiries." },
  { icon: CalendarCheck, num: "03", title: "Peace of Mind", body: "Move forward with a plan that protects loved ones, preserves assets where possible, and gives your family more confidence." },
  { icon: BarChart3, num: "04", title: "Local Support", body: "Work with a local team that understands the family, financial, and emotional realities behind elder law decisions." },
];

const COMPETITOR_ROWS = [
  { label: "Response Time", you: "10 minutes", them: "3 days" },
  { label: "Inquiry Follow-Up", you: "Automatic", them: "Manual (if at all)" },
  { label: "Peace of Mind", you: "24/7", them: "Phone only" },
  { label: "Client Visibility", you: "Real-time dashboard", them: "Spreadsheet (maybe)" },
  { label: "Missed Inquiry Recovery", you: "Automatic text + email", them: "None" },
];

const FAQ = [
  { q: "How quickly can we schedule a consultation?", a: "We offer a free initial consultation and work to schedule families promptly based on urgency and availability." },
  { q: "Do you offer free consultations?", a: "Yes. Your initial consultation is free with no obligation. We'll listen to your situation, explain your options, and give you an honest assessment of your case." },
  { q: "What practice areas do you cover?", a: "We focus on elder law, estate planning, probate, guardianship, long-term care planning, and veterans benefits for families in Needham and Greater Boston." },
  { q: "How are your fees structured?", a: "Fee structures vary by practice area. Personal injury cases are handled on contingency (no fee unless we win). Other matters use flat fees or hourly billing, always disclosed upfront before engagement." },
  { q: "Is my consultation confidential?", a: "Absolutely. All communications with our firm are protected by attorney-client privilege from the moment you contact us." },
  { q: "Can I schedule a consultation online?", a: "Yes. You can book a consultation directly from our website 24/7. Choose a time that works for you and receive instant confirmation." },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) } as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } } as const;

function Stars({ count }: { count: number }) {
  return <span className="text-amber-400 tracking-wider">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

export default function HomePage() {
  const BRAND = getBrand();

  return (
    <div className="grain min-h-screen bg-white">
      <LiveToast />

      {/* ══════════ LIVE NOTIFICATION BAR ══════════ */}
      <div className="bg-[#0f1f35] text-white text-center text-[13px] font-medium py-2.5 px-4 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Free initial consultations available — call or schedule confidentially today</span>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f35] via-[#162d4a] to-[#1a3550]" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(at 25% 75%, rgba(30,58,95,0.4) 0, transparent 50%), radial-gradient(at 75% 25%, rgba(212,175,55,0.12) 0, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-32 md:pt-24 md:pb-40">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.div custom={0} variants={fadeUp}>
              <Badge variant="outline" className="text-amber-300 border-amber-300/30 bg-amber-300/10 mb-6 text-sm font-medium px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 mr-1.5" /> {BRAND.responseMin}-Minute Response to Every Inquiry
              </Badge>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight">
              Your Next Client Called.{" "}
              <span className="text-amber-300">You Didn&apos;t Answer.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
              Thoughtful elder law planning helps families make clear decisions before a crisis. We guide you with warmth, clarity, and practical next steps.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Scale, label: "Bar Admitted" },
                { icon: Star, label: "Super Lawyers" },
                { icon: Shield, label: "NAELA Member" },
                { icon: Lock, label: "Confidential" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 text-[13px] text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <b.icon className="w-3.5 h-3.5 text-amber-300" /> {b.label}
                </span>
              ))}
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4">
              <BookingModal trigger={
                <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-[#0f1f35] font-bold text-base px-8 h-14 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.02] transition-all">
                  <CalendarCheck className="w-5 h-5 mr-2" />
                  Schedule Free Consultation
                </Button>
              } brandColor="#1e3a5f" />
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-medium text-base px-8 h-14 rounded-full">
                <a href="#how">See How It Works <ChevronRight className="w-4 h-4 ml-1" /></a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating response scoreboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2"
          >
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center w-60">
              <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-3">Your Response</p>
              <p className="font-display text-7xl font-bold text-amber-300 leading-none">{BRAND.responseMin}</p>
              <p className="text-slate-300 text-sm mt-1 font-medium">minutes avg</p>
              <div className="mt-5 pt-5 border-t border-white/10 space-y-1">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest">Industry avg</p>
                <p className="text-slate-400 font-semibold text-lg line-through decoration-red-400/60 decoration-2">3 days</p>
              </div>
              <div className="mt-4 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3" /> Faster than 98% of firms
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ THE PROBLEM ══════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p custom={0} variants={fadeUp} className="text-red-500 font-semibold text-sm uppercase tracking-widest mb-4">The Problem</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[#0f1f35] tracking-tight leading-tight">
              The Average Law Firm Takes 3 Days to Return a Consultation Request.
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="mt-6 text-slate-500 text-lg leading-relaxed max-w-2xl">
              By then, your potential client already hired someone else. They&apos;re not waiting. They&apos;re Googling, calling, and retaining whoever responds first.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-10 rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                Why families benefit from planning before a crisis
              </div>
              {[
                ["Potential client submits intake form Friday evening", "You see it Monday morning"],
                ["They contact 3 firms over the weekend", "You're the last to respond"],
                ["They retain whoever called back first", "You never had a chance"],
                ["That case was worth $5,000–$15,000", "Gone. Every month."],
              ].map(([what, impact], i) => (
                <div key={i} className={`flex flex-col sm:flex-row px-6 py-4 ${i < 3 ? "border-b border-slate-100" : ""}`}>
                  <span className="sm:w-1/2 text-slate-700 font-medium text-[15px]">{what}</span>
                  <span className="sm:w-1/2 text-slate-500 text-[15px] mt-1 sm:mt-0">{impact}</span>
                </div>
              ))}
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="mt-8 p-5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-display font-bold text-xl">
                $10,000+/month in lost revenue. <span className="font-normal text-red-600 text-base">And it compounds — lost clients don&apos;t refer.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ THE SOLUTION ══════════ */}
      <section id="how" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p custom={0} variants={fadeUp} className="text-[#1e3a5f] font-semibold text-sm uppercase tracking-widest mb-3">The Solution</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f1f35] tracking-tight">
              Respond First. Win the Client.<br className="hidden sm:block" /> It&apos;s That Simple.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 gap-6">
            {SOLUTION_STEPS.map((step, i) => (
              <motion.div key={step.num} custom={i} variants={fadeUp}>
                <Card className="h-full border-slate-200 hover:border-[#1e3a5f]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="pt-7 pb-6 px-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-display text-sm font-bold text-[#1e3a5f] bg-[#1e3a5f]/10 w-9 h-9 flex items-center justify-center rounded-lg">{step.num}</span>
                      <h3 className="font-display text-lg font-bold text-[#0f1f35]">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{step.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ CREDENTIALS / TRUST ══════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p custom={0} variants={fadeUp} className="text-[#1e3a5f] font-semibold text-sm uppercase tracking-widest mb-3">Credentials</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f1f35] tracking-tight">
              Why Clients Trust Our Firm
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div key={item.label} custom={i} variants={fadeUp} className="flex items-start gap-4 p-5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#1e3a5f]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#0f1f35] text-[15px]">{item.label}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ PRACTICE AREAS ══════════ */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#1e3a5f] font-semibold text-sm uppercase tracking-widest mb-3">Practice Areas</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0f1f35] tracking-tight">Areas of Practice</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRACTICE_AREAS.map((area) => (
              <div key={area.name} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-[#1e3a5f]/30 hover:shadow-sm transition-all">
                <area.icon className="w-5 h-5 text-[#1e3a5f] flex-shrink-0" />
                <span className="font-display font-semibold text-[#0f1f35] text-sm">{area.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ COMPETITOR COMPARISON ══════════ */}
      <section className="py-20 md:py-28 bg-[#0f1f35]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.p custom={0} variants={fadeUp} className="text-amber-300 font-semibold text-sm uppercase tracking-widest mb-3">Comparison</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">Why Families Choose Heritage Elder Law Group</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
              <span className="text-slate-500"></span>
              <span className="text-amber-300 text-center">Your Firm</span>
              <span className="text-slate-500 text-center">Average Firm</span>
            </div>
            {COMPETITOR_ROWS.map((row, i) => (
              <motion.div key={row.label} custom={i} variants={fadeUp} className={`grid grid-cols-3 px-6 py-4 items-center ${i < COMPETITOR_ROWS.length - 1 ? "border-b border-white/5" : ""}`}>
                <span className="text-slate-300 text-sm font-medium">{row.label}</span>
                <span className="text-center text-white font-bold text-sm">{row.you}</span>
                <span className="text-center text-slate-500 text-sm">{row.them}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p custom={0} variants={fadeUp} className="text-[#1e3a5f] font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f1f35] tracking-tight">What Families Say</motion.h2>
            <motion.p custom={2} variants={fadeUp} className="text-slate-500 mt-3 text-lg">
              <Stars count={5} /> <span className="font-semibold text-[#0f1f35]">5.0</span> average from 5 featured family reviews
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.slice(0, 3).map((r, i) => (
              <motion.div key={r.name} custom={i} variants={fadeUp}>
                <Card className="h-full border-slate-200">
                  <CardContent className="pt-6 pb-5 px-6">
                    <Stars count={r.rating} />
                    <p className="mt-3 text-slate-600 text-[15px] leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-[#0f1f35]">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.service}</p>
                      </div>
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            {REVIEWS.slice(3).map((r) => (
              <div key={r.name} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                <div className="flex-shrink-0 mt-0.5"><Stars count={r.rating} /></div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-1.5">{r.name} · {r.service} · {r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.p custom={0} variants={fadeUp} className="text-[#1e3a5f] font-semibold text-sm uppercase tracking-widest mb-3">FAQ</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-[#0f1f35] tracking-tight">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-slate-200">
                <AccordionTrigger className="text-left font-display font-semibold text-[#0f1f35] hover:text-[#1e3a5f] text-[15px] py-5">{item.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-[15px] leading-relaxed pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══════════ BOTTOM CTA ══════════ */}
      <section id="consult" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f35] via-[#162d4a] to-[#1a3550]" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(at 60% 40%, rgba(212,175,55,0.2) 0, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Ready to protect your family's future?
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
              Get your free intake audit. We&apos;ll show you exactly how fast your firm responds to inquiries — and what it&apos;s costing you.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-[#0f1f35] font-bold text-base px-10 h-14 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.02] transition-all">
                <a href={`tel:${BRAND.phone}`}>
                  Schedule Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
            <motion.p custom={3} variants={fadeUp} className="mt-4 text-sm text-slate-400">
              No fee. No commitment. Confidential.
            </motion.p>
            <motion.p custom={4} variants={fadeUp} className="mt-6 text-slate-300">
              Call now: <a href={`tel:${BRAND.phone}`} className="text-amber-300 font-bold hover:text-amber-200 transition-colors">{BRAND.phone}</a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-[#0a1525] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-bold text-white text-lg">{BRAND.name}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">Warm, experienced elder law guidance for families in Needham and Greater Boston.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm mb-3">Practice Areas</h4>
              <ul className="space-y-1.5">
                {PRACTICE_AREAS.map((area) => <li key={area.name} className="text-slate-400 text-sm">{area.name}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm mb-3">Contact</h4>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li><a href={`tel:${BRAND.phone}`} className="hover:text-amber-300 transition-colors">{BRAND.phone}</a></li>
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {BRAND.area}</li>
                <li>Free Initial Consultation</li>
                <li>Attorney-Client Privilege</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved. Powered by <a href="https://cogrow.ai" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">CoGrow</a></span>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Attorney Advertising</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
