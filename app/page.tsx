"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Clock, Shield, Star, ChevronDown, Zap, Wrench, Flame, Droplets, AlertTriangle, CheckCircle2, ArrowRight, MapPin, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* ── Config (pulls from white-label at build, hardcoded for client component) ── */
const BRAND = {
  name: "Apex Plumbing & HVAC",
  tagline: "Fast. Reliable. Guaranteed.",
  phone: "(555) 123-4567",
  area: "Chicago Metro Area",
  years: 12,
  responseMin: 15,
  accentColor: "#f59e0b",
};

const SERVICES = [
  { name: "Emergency Plumbing", icon: AlertTriangle, desc: "Burst pipes, leaks, and flooding — we're there in minutes, not hours." },
  { name: "HVAC Repair", icon: Flame, desc: "No heat? No AC? Same-day diagnosis and repair for all brands." },
  { name: "Drain Cleaning", icon: Droplets, desc: "Stubborn clogs and slow drains cleared fast with professional equipment." },
  { name: "Water Heaters", icon: Zap, desc: "Repair or replace. Tank and tankless. Same-day service available." },
  { name: "Sewer & Water Lines", icon: Wrench, desc: "Trenchless repair, camera inspection, and full line replacement." },
  { name: "24/7 Emergency", icon: Phone, desc: "Nights, weekends, holidays — we answer every call, every time." },
];

const REVIEWS = [
  { name: "Sarah M.", service: "Emergency Plumbing", text: "Called at 7am with a burst pipe. They were here by 7:30. Fixed it in under an hour. Saved my basement.", rating: 5, date: "2 weeks ago" },
  { name: "David K.", service: "HVAC Installation", text: "Best HVAC company I've worked with. Installed a new furnace, explained everything, cleaned up perfectly.", rating: 5, date: "1 month ago" },
  { name: "Jennifer R.", service: "Drain Cleaning", text: "Third time using them. Always on time, always fair pricing. My go-to for anything plumbing.", rating: 5, date: "3 weeks ago" },
  { name: "Mike T.", service: "Water Heater Repair", text: "Quick response, professional crew. Fixed our water heater same day. Price was fair.", rating: 4, date: "1 month ago" },
  { name: "Lisa P.", service: "Sewer Replacement", text: "They replaced our entire sewer line. Massive job. Came in on budget and ahead of schedule.", rating: 5, date: "2 months ago" },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Licensed & Insured" },
  { icon: CheckCircle2, label: "Background Checked" },
  { icon: Star, label: "Satisfaction Guaranteed" },
  { icon: Award, label: "Up-Front Pricing" },
  { icon: Zap, label: "Same-Day Service" },
  { icon: Clock, label: "24/7 Emergency" },
];

const FAQ = [
  { q: "How fast do you respond to service calls?", a: "We respond within 15 minutes to all service requests. Our technicians are stationed throughout the Chicago Metro Area so we can reach you quickly, even for emergencies." },
  { q: "Are your technicians licensed and insured?", a: "Yes. Every technician is fully licensed, insured, and background-checked. We carry general liability and workers compensation insurance for your protection." },
  { q: "Do you offer free estimates?", a: "Yes. We provide free, no-obligation estimates for all services. We give you the price upfront before any work begins — no surprises." },
  { q: "What areas do you serve?", a: "We serve the entire Chicago Metro Area including all surrounding suburbs. Call us to confirm service availability in your specific location." },
  { q: "Do you offer emergency service?", a: "Yes. We offer 24/7 emergency service for plumbing, HVAC, and drain emergencies. Call us anytime — nights, weekends, and holidays included." },
  { q: "Do you guarantee your work?", a: "Yes. All of our work comes with a satisfaction guarantee. If something is not right, we will make it right at no additional cost." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
} as const;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

function Stars({ count }: { count: number }) {
  return <span className="text-amber-400">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

export default function HomePage() {
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className="grain min-h-screen bg-white">
      {/* ── LIVE LEAD BAR ── */}
      <div className="bg-brand-slate text-white text-center text-sm font-medium py-2 px-4">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span>3 service requests in the last hour</span>
          <span className="hidden sm:inline text-white/50">·</span>
          <span className="hidden sm:inline text-white/60">Average response: {BRAND.responseMin} min</span>
        </span>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background: Diagonal split with gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-slate via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(at 20% 80%, rgba(245,158,11,0.3) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(59,130,246,0.15) 0px, transparent 50%)" }} />
        {/* Angled bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-32 md:pt-24 md:pb-40">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.div custom={0} variants={fadeUp}>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 mb-6 text-sm font-medium px-3 py-1">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {BRAND.responseMin}-Minute Response Guarantee
              </Badge>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              {BRAND.name.split(" & ")[0]}
              <span className="text-amber-400"> & {BRAND.name.split(" & ")[1]}</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="mt-5 text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
              {BRAND.years}+ years of {BRAND.tagline.toLowerCase().replace(".", "")} service in {BRAND.area}. Licensed, insured, and ready now.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-brand-slate font-bold text-base px-8 py-6 rounded-full shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-400/40 hover:scale-[1.02]">
                <a href={`tel:${BRAND.phone}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now: {BRAND.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-medium text-base px-8 py-6 rounded-full">
                <a href="#services">
                  View Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>

            {/* Trust proof strip */}
            <motion.div custom={4} variants={fadeUp} className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-amber-400" /> Licensed & Insured</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> {avgRating}/5 ({REVIEWS.length} reviews)</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" /> {BRAND.area}</span>
            </motion.div>
          </motion.div>

          {/* Response time scoreboard — offset right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center w-56">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-2">Response Time</p>
              <p className="font-display text-6xl font-bold text-amber-400">{BRAND.responseMin}</p>
              <p className="text-slate-300 text-sm mt-1">minutes avg</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-500">Industry average</p>
                <p className="text-slate-400 font-medium line-through decoration-red-400/60">47 hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="py-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                custom={i}
                variants={fadeUp}
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <badge.icon className="w-6 h-6 text-brand-slate" />
                <span className="text-xs font-semibold text-slate-600 text-center">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Do</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-slate tracking-tight">
              Services built for<br className="hidden sm:block" /> real emergencies
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.name} custom={i} variants={fadeUp}>
                <Card className="group h-full border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                  <CardContent className="pt-7 pb-6 px-6">
                    <div className="w-11 h-11 rounded-lg bg-brand-slate/5 flex items-center justify-center mb-4 group-hover:bg-amber-400/10 transition-colors">
                      <svc.icon className="w-5 h-5 text-brand-slate group-hover:text-amber-600 transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-brand-slate mb-2">{svc.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{svc.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ── */}
      <section className="py-16 bg-brand-slate">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p custom={0} variants={fadeUp} className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Speed Advantage</motion.p>
            <motion.div custom={1} variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 py-8">
              <div>
                <p className="font-display text-5xl md:text-6xl font-bold text-white">{BRAND.responseMin}<span className="text-2xl text-slate-400 ml-1">min</span></p>
                <p className="text-slate-400 text-sm mt-1">Our avg response</p>
              </div>
              <div className="text-3xl text-slate-600">vs</div>
              <div>
                <p className="font-display text-5xl md:text-6xl font-bold text-red-400/80 line-through decoration-2">47<span className="text-2xl text-slate-500 ml-1">hrs</span></p>
                <p className="text-slate-400 text-sm mt-1">Industry average</p>
              </div>
            </motion.div>
            <motion.p custom={2} variants={fadeUp} className="text-2xl font-display font-bold text-amber-400">
              We&apos;re 188x faster than average
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Reviews</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-slate tracking-tight">
              What our customers say
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="text-slate-500 mt-3 text-lg">
              <Stars count={5} /> <span className="font-semibold text-brand-slate">{avgRating}</span> average from {REVIEWS.length} reviews
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {REVIEWS.slice(0, 3).map((review, i) => (
              <motion.div key={review.name} custom={i} variants={fadeUp}>
                <Card className="h-full border-slate-200">
                  <CardContent className="pt-6 pb-5 px-6">
                    <Stars count={review.rating} />
                    <p className="mt-3 text-slate-600 text-[15px] leading-relaxed italic">&ldquo;{review.text}&rdquo;</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-brand-slate">{review.name}</p>
                        <p className="text-xs text-slate-400">{review.service}</p>
                      </div>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Remaining reviews in a compact row */}
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            {REVIEWS.slice(3).map((review) => (
              <div key={review.name} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
                <Stars count={review.rating} />
                <div className="min-w-0">
                  <p className="text-sm text-slate-600 line-clamp-2">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-1">{review.name} · {review.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.p custom={0} variants={fadeUp} className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">FAQ</motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-brand-slate tracking-tight">
              Common questions
            </motion.h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-slate-200">
                <AccordionTrigger className="text-left font-display font-semibold text-brand-slate hover:text-amber-600 text-[15px] py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 text-[15px] leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-slate via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(at 70% 30%, rgba(245,158,11,0.25) 0px, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Need service?<br />We respond in {BRAND.responseMin} minutes.
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="mt-5 text-slate-300 text-lg">
              Call now or request service online. Free estimates, always.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-brand-slate font-bold text-base px-8 py-6 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] transition-all">
                <a href={`tel:${BRAND.phone}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {BRAND.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-medium text-base px-8 py-6 rounded-full">
                <Link href="/login">
                  Owner Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-brand-slate border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-bold text-white text-lg">{BRAND.name}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{BRAND.tagline} Serving {BRAND.area} for {BRAND.years}+ years.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm mb-3">Services</h4>
              <ul className="space-y-1.5">
                {SERVICES.map((svc) => (
                  <li key={svc.name} className="text-slate-400 text-sm">{svc.name}</li>
                ))}
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
          <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
