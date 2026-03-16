"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Clock, Shield, Star, Zap, Wrench, Flame, Droplets, AlertTriangle, CheckCircle2, ArrowRight, MapPin, Award, TrendingDown, MessageSquare, CalendarCheck, BarChart3, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const BRAND = {
  name: "Apex Plumbing & HVAC",
  phone: "(555) 123-4567",
  area: "Chicago Metro Area",
  years: 12,
  responseMin: 4,
};

const SERVICES = [
  { name: "Emergency Plumbing", icon: AlertTriangle },
  { name: "HVAC Installation & Repair", icon: Flame },
  { name: "Drain Cleaning", icon: Droplets },
  { name: "Water Heater Service", icon: Zap },
  { name: "Sewer & Water Lines", icon: Wrench },
  { name: "Furnace Maintenance", icon: Wrench },
];

const REVIEWS = [
  { name: "Sarah M.", service: "Emergency Plumbing", text: "Called at 7am with a burst pipe. They were here by 7:30. Fixed it in under an hour. Saved my basement.", rating: 5, date: "2 weeks ago" },
  { name: "David K.", service: "HVAC Installation", text: "I've used three other HVAC companies. This is the first one that actually showed up on time AND finished on time. They're my go-to now.", rating: 5, date: "1 month ago" },
  { name: "Jennifer R.", service: "Drain Cleaning", text: "Third time using them. Always on time, always fair pricing. My go-to for anything plumbing.", rating: 5, date: "3 weeks ago" },
  { name: "Mike T.", service: "Water Heater Repair", text: "Quick response, professional crew. Fixed our water heater same day. Price was fair — actually cheaper than the quote.", rating: 4, date: "1 month ago" },
  { name: "Lisa P.", service: "Sewer Replacement", text: "They replaced our entire sewer line. Massive job. Came in on budget and ahead of schedule. Can't recommend enough.", rating: 5, date: "2 months ago" },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "Licensed & Insured", desc: "Full coverage. Full peace of mind." },
  { icon: CheckCircle2, label: "Background Checked", desc: "Every team member vetted and verified." },
  { icon: Star, label: "Satisfaction Guaranteed", desc: "If you're not happy, we make it right." },
  { icon: Award, label: "Upfront Pricing", desc: "No surprises. No hidden fees. Ever." },
  { icon: Zap, label: "Same-Day Service", desc: "Most calls answered and scheduled same day." },
  { icon: Clock, label: "24/7 Emergency", desc: "Midnight pipe burst? We're already on the way." },
];

const SOLUTION_STEPS = [
  { icon: Zap, num: "01", title: "Instant Alerts", body: "The second someone contacts your business — phone, form, email — you get notified instantly. Not in an hour. Not tomorrow morning. Now." },
  { icon: MessageSquare, num: "02", title: "Automatic Follow-Up", body: "Didn't answer? The system sends a text within 60 seconds: \"Hey, thanks for reaching out. We got your message and someone will call you within 5 minutes.\" That one text saves 40% of leads that would have gone to your competitor." },
  { icon: CalendarCheck, num: "03", title: "Smart Booking", body: "Customers can book directly from your website — 24/7. No phone tag. No missed calls. They pick a time, you show up." },
  { icon: BarChart3, num: "04", title: "Owner Dashboard", body: "See every lead, every response time, every booked job — all in one place. Know exactly how your business is performing, every day." },
];

const COMPETITOR_ROWS = [
  { label: "Response Time", you: "4 minutes", them: "47 hours" },
  { label: "Lead Follow-Up", you: "Automatic", them: "Manual (if at all)" },
  { label: "Online Booking", you: "24/7", them: "Phone only" },
  { label: "Customer Visibility", you: "Real-time dashboard", them: "Spreadsheet (maybe)" },
  { label: "Missed Lead Recovery", you: "Automatic text + email", them: "None" },
];

const FAQ = [
  { q: "How fast do you respond to service calls?", a: "We respond within 15 minutes to all service requests. Emergency calls get priority — we're often on-site within 30 minutes." },
  { q: "Do you offer free estimates?", a: "Yes. All estimates are free, with no obligation. We'll assess the job and give you an upfront price before any work begins." },
  { q: "Are you licensed and insured?", a: "Yes. We are fully licensed, bonded, and insured. All team members are background checked." },
  { q: "Do you offer emergency service?", a: "Yes. We're available 24/7 for emergency plumbing and HVAC calls. Burst pipes, no heat, gas leaks — call us anytime." },
  { q: "What areas do you serve?", a: "We serve the entire Chicago Metro Area including Naperville, Schaumburg, Arlington Heights, Oak Park, Brookfield, and surrounding suburbs." },
  { q: "How does online booking work?", a: "Visit our website and pick a time that works for you. You'll get instant confirmation and a reminder before your appointment. No phone tag needed." },
];

/* ── Animation variants ── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) } as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } } as const;

function Stars({ count }: { count: number }) {
  return <span className="text-amber-400 tracking-wider">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

export default function HomePage() {
  return (
    <div className="grain min-h-screen bg-white">

      {/* ══════════ LIVE LEAD BAR ══════════ */}
      <div className="bg-brand-slate text-white text-center text-[13px] font-medium py-2.5 px-4 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span>3 new leads today — average response time: <strong>{BRAND.responseMin} minutes</strong></span>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-slate via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(at 20% 80%, rgba(245,158,11,0.3) 0, transparent 50%), radial-gradient(at 80% 20%, rgba(59,130,246,0.12) 0, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-32 md:pt-24 md:pb-40">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.div custom={0} variants={fadeUp}>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 mb-6 text-sm font-medium px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 mr-1.5" /> Respond in Under 5 Minutes
              </Badge>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight">
              Stop Losing Customers to{" "}
              <span className="text-amber-400">Slow Response Times.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
              Every missed call is money walking to your competitor. We help home service businesses respond in minutes, not hours.
            </motion.p>

            {/* Hero trust badges */}
            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Zap, label: "Respond in Under 5 Minutes" },
                { icon: Phone, label: "Never Miss a Lead Again" },
                { icon: TrendingDown, label: "Book 3x More Jobs" },
                { icon: Star, label: "4.8★ Average Client Rating" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 text-[13px] text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <b.icon className="w-3.5 h-3.5 text-amber-400" /> {b.label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div custom={4} variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-brand-slate font-bold text-base px-8 h-14 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] transition-all">
                <a href="#audit">
                  Get Your Free Response Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-medium text-base px-8 h-14 rounded-full">
                <a href="#solution">See How It Works <ChevronRight className="w-4 h-4 ml-1" /></a>
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
              <p className="font-display text-7xl font-bold text-amber-400 leading-none">{BRAND.responseMin}</p>
              <p className="text-slate-300 text-sm mt-1 font-medium">minutes avg</p>
              <div className="mt-5 pt-5 border-t border-white/10 space-y-1">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest">Industry avg</p>
                <p className="text-slate-400 font-semibold text-lg line-through decoration-red-400/60 decoration-2">47 hours</p>
              </div>
              <div className="mt-4 text-xs text-green-400 font-semibold flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3" /> 12% faster this week
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
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-brand-slate tracking-tight leading-tight">
              47 Hours. That&apos;s How Long the Average Home Service Business Takes to Respond to a Lead.
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="mt-6 text-slate-500 text-lg leading-relaxed max-w-2xl">
              By then, your customer already called someone else. They&apos;re not waiting. They&apos;re scrolling, clicking, and booking with whoever answers first.
            </motion.p>

            {/* Cost breakdown table */}
            <motion.div custom={3} variants={fadeUp} className="mt-10 rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                What slow response really costs you
              </div>
              {[
                ["Lead comes in at 8pm", "You see it at 9am tomorrow"],
                ["Customer calls 3 businesses", "You're #3 to respond"],
                ["They book with whoever answers first", "You never even had a chance"],
                ["That job was worth $800", "Gone. Every week."],
              ].map(([what, impact], i) => (
                <div key={i} className={`flex flex-col sm:flex-row px-6 py-4 ${i < 3 ? "border-b border-slate-100" : ""}`}>
                  <span className="sm:w-1/2 text-slate-700 font-medium text-[15px]">{what}</span>
                  <span className="sm:w-1/2 text-slate-500 text-[15px] mt-1 sm:mt-0">{impact}</span>
                </div>
              ))}
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="mt-8 p-5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-display font-bold text-xl">
                $3,200/month in lost revenue. <span className="font-normal text-red-600 text-base">That&apos;s not a guess — we measure it.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ THE SOLUTION ══════════ */}
      <section id="solution" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">The Solution</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-slate tracking-tight">
              Respond First. Win More.<br className="hidden sm:block" /> It&apos;s That Simple.
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="mt-5 text-slate-500 text-lg max-w-2xl mx-auto">
              We built a system that makes sure you never miss another lead. Here&apos;s how it works:
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 gap-6">
            {SOLUTION_STEPS.map((step, i) => (
              <motion.div key={step.num} custom={i} variants={fadeUp}>
                <Card className="h-full border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="pt-7 pb-6 px-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-display text-sm font-bold text-amber-500 bg-amber-50 w-9 h-9 flex items-center justify-center rounded-lg">{step.num}</span>
                      <h3 className="font-display text-lg font-bold text-brand-slate">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{step.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ TRUST / AUTHORITY ══════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Trust</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-slate tracking-tight">
              Why Businesses Trust Us
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div key={item.label} custom={i} variants={fadeUp} className="flex items-start gap-4 p-5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-slate text-[15px]">{item.label}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Services</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-slate tracking-tight">What We Do</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SERVICES.map((svc) => (
              <div key={svc.name} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all">
                <svc.icon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="font-display font-semibold text-brand-slate text-sm">{svc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ COMPETITOR COMPARISON ══════════ */}
      <section className="py-20 md:py-28 bg-brand-slate">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.p custom={0} variants={fadeUp} className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Comparison</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">How You Compare</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
              <span className="text-slate-500"></span>
              <span className="text-amber-400 text-center">You</span>
              <span className="text-slate-500 text-center">Industry Avg</span>
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

      {/* ══════════ REVIEWS ══════════ */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Reviews</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-slate tracking-tight">What Our Customers Say</motion.h2>
            <motion.p custom={2} variants={fadeUp} className="text-slate-500 mt-3 text-lg">
              <Stars count={5} /> <span className="font-semibold text-brand-slate">4.8</span> average from 127 reviews
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
                        <p className="font-semibold text-sm text-brand-slate">{r.name}</p>
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
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">FAQ</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-brand-slate tracking-tight">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-slate-200">
                <AccordionTrigger className="text-left font-display font-semibold text-brand-slate hover:text-amber-600 text-[15px] py-5">{item.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-[15px] leading-relaxed pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══════════ BOTTOM CTA ══════════ */}
      <section id="audit" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-slate via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(at 60% 40%, rgba(245,158,11,0.25) 0, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Ready to Stop Losing Leads?
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
              Get your free response audit. We&apos;ll test your business and show you exactly how fast (or slow) you&apos;re responding to customers — and what it&apos;s costing you.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-brand-slate font-bold text-base px-10 h-14 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] transition-all">
                <a href={`tel:${BRAND.phone}`}>
                  Get My Free Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
            <motion.p custom={3} variants={fadeUp} className="mt-4 text-sm text-slate-400">
              No credit card. No commitment. Takes 2 minutes.
            </motion.p>
            <motion.p custom={4} variants={fadeUp} className="mt-6 text-slate-300">
              Or call now: <a href={`tel:${BRAND.phone}`} className="text-amber-400 font-bold hover:text-amber-300 transition-colors">{BRAND.phone}</a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-brand-slate border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-bold text-white text-lg">{BRAND.name}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">Serving {BRAND.area} for {BRAND.years}+ years. Licensed & Insured.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm mb-3">Services</h4>
              <ul className="space-y-1.5">
                {SERVICES.map((svc) => <li key={svc.name} className="text-slate-400 text-sm">{svc.name}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm mb-3">Contact</h4>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li><a href={`tel:${BRAND.phone}`} className="hover:text-amber-400 transition-colors">{BRAND.phone}</a></li>
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {BRAND.area}</li>
                <li>24/7 Emergency Available</li>
                <li>Licensed & Insured</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
