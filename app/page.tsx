"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookingModal } from "@/components/booking-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, CalendarCheck, ChevronRight, Clock, HeartHandshake, Home, Landmark, Lock, MapPin, Phone, Scale, ShieldCheck, Star, Users } from "lucide-react";
import { getBrand } from "@/lib/brand-client";

const PRACTICE_AREAS = [
  {
    title: "Elder Law & Medicaid Planning",
    description: "Protect assets, plan for care costs, and make thoughtful decisions before a health crisis forces your hand.",
    icon: ShieldCheck,
  },
  {
    title: "Estate Planning & Trusts",
    description: "Create wills, trusts, powers of attorney, and healthcare documents that give your family clarity and peace of mind.",
    icon: BookOpen,
  },
  {
    title: "Probate & Estate Administration",
    description: "Navigate probate with steady legal guidance after a loss, with less confusion and less strain on the family.",
    icon: Landmark,
  },
  {
    title: "Guardianship & Conservatorship",
    description: "Get help when a loved one can no longer make safe decisions independently and legal authority becomes necessary.",
    icon: Users,
  },
  {
    title: "Long-Term Care Planning",
    description: "Prepare for future care needs with practical legal strategies that balance dignity, protection, and financial reality.",
    icon: Home,
  },
  {
    title: "Veterans Benefits",
    description: "Understand eligibility, coordinate benefits planning, and make sure veteran families are not leaving options unused.",
    icon: Award,
  },
];

const TRUST_STRIP = ["NAELA Member", "15+ Years Serving Greater Boston", "Free Initial Consultation", "Confidential Guidance"];

const WHY_US = [
  {
    title: "Focused on elder law, not general practice noise",
    body: "Families facing aging-parent decisions need guidance from a team that understands Medicaid, estate planning, probate, guardianship, and long-term care planning together.",
  },
  {
    title: "Warm, clear communication in difficult moments",
    body: "This work is personal. We explain options in plain language, move at the right pace, and help families feel steady instead of overwhelmed.",
  },
  {
    title: "Local guidance for Needham and Greater Boston families",
    body: "We understand the practical realities families face across Needham, Wellesley, Newton, Dedham, Dover, Brookline, and nearby communities.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Free consultation",
    body: "Share what your family is facing and get a clear first conversation about priorities, risks, and the best next step.",
  },
  {
    step: "02",
    title: "Custom plan",
    body: "We build the right legal plan around your family, whether that means Medicaid planning, trust work, probate support, or guardianship guidance.",
  },
  {
    step: "03",
    title: "Peace of mind",
    body: "Move forward knowing the legal pieces are in place and your family has a clearer path through a difficult season.",
  },
];

const TESTIMONIALS = [
  {
    name: "Karen M.",
    service: "Medicaid Planning",
    text: "We were overwhelmed trying to help my mother qualify for long-term care. Heritage Elder Law Group walked us through Medicaid planning with patience and clarity, and we finally felt like we had a plan.",
    rating: 5,
  },
  {
    name: "Thomas & Ellen R.",
    service: "Estate Planning & Trusts",
    text: "We put off our estate plan for years. They made the process calm, organized, and far easier than we expected. We left with real peace of mind.",
    rating: 5,
  },
  {
    name: "Melissa D.",
    service: "Probate & Estate Administration",
    text: "After my father passed away, probate felt impossible to navigate alone. They explained each step, kept us informed, and handled everything with compassion.",
    rating: 5,
  },
  {
    name: "George P.",
    service: "Guardianship & Conservatorship",
    text: "We needed guardianship for an aging parent and did not know where to begin. They were steady, responsive, and thoughtful through the entire process.",
    rating: 5,
  },
  {
    name: "William H.",
    service: "Veterans Benefits",
    text: "As a veteran, I was not sure what benefits my family could access. They helped us understand the options and put a plan in place that actually made a difference.",
    rating: 5,
  },
];

const FAQ = [
  {
    q: "What is elder law?",
    a: "Elder law focuses on the legal and financial issues that affect older adults and their families, including estate planning, long-term care planning, Medicaid, probate, guardianship, and veterans benefits.",
  },
  {
    q: "When should I start planning?",
    a: "Earlier is better. Planning before a health crisis gives your family more options, less stress, and more time to make thoughtful decisions.",
  },
  {
    q: "How does Medicaid planning work?",
    a: "Medicaid planning looks at assets, income, care needs, and timing to help families protect what they can while preparing for long-term care costs within the rules.",
  },
  {
    q: "What's the difference between a will and a trust?",
    a: "A will says how assets should be handled after death, while a trust can manage assets during life and after death, often with more control, privacy, and probate avoidance.",
  },
  {
    q: "How much does a consultation cost?",
    a: "We offer a free initial consultation so families can understand their options and decide on the right next step before making a commitment.",
  },
  {
    q: "Can you help with VA benefits?",
    a: "Yes. We help eligible veterans and families understand benefits planning and how it may fit into a broader long-term care strategy.",
  },
];

const SERVICE_AREAS = ["Needham", "Wellesley", "Newton", "Dedham", "Dover", "Brookline", "Westwood", "Greater Boston"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
} as const;

function Stars({ count }: { count: number }) {
  return <span className="tracking-[0.2em] text-amber-500">{"★".repeat(count)}</span>;
}

export default function HomePage() {
  const brand = getBrand();
  const phoneHref = `tel:${brand.phone.replace(/[^\d]/g, "")}`;

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#182638]">
      <div className="border-b border-[#d8c7ac] bg-[#182638] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#f2dfb8] sm:text-sm">
        Protecting Families. Preserving Legacies.
      </div>

      <section className="relative overflow-hidden border-b border-[#ddd2c1] bg-[linear-gradient(180deg,#fbf6ee_0%,#f3eadb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(208,171,103,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(24,38,56,0.08),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.p custom={0} variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9f7743]">
              Heritage Elder Law Group
            </motion.p>
            <motion.h1 custom={1} variants={fadeUp} className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-[#182638] md:text-7xl">
              Your family&apos;s future, protected with warmth, clarity, and experience.
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Elder law and estate planning guidance for families in Needham and Greater Boston who want thoughtful legal help before a crisis turns into chaos.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <BookingModal
                trigger={
                  <Button size="lg" className="h-14 rounded-full bg-[#182638] px-8 text-base font-bold text-[#f7f2e8] hover:bg-[#23364f]">
                    <CalendarCheck className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                }
                brandColor="#1b2a41"
              />
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-[#c8b18c] bg-white/80 px-8 text-base font-semibold text-[#182638] hover:bg-white">
                <a href={phoneHref}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
            </motion.div>
            <motion.div custom={4} variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {TRUST_STRIP.map((item) => (
                <span key={item} className="rounded-full border border-[#d7cab7] bg-white/85 px-4 py-2 text-sm font-medium text-slate-600">
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45 }}>
            <Card className="rounded-[2rem] border-[#d8c7ac] bg-white/95 shadow-[0_24px_60px_rgba(24,38,56,0.10)]">
              <CardContent className="p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9f7743]">Why families reach out</p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#182638]">
                  Calm guidance for some of life&apos;s hardest decisions.
                </h2>
                <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-600">
                  <div className="flex items-start gap-3">
                    <HeartHandshake className="mt-1 h-4 w-4 text-[#b88a48]" />
                    <p>Medicaid planning for aging parents and long-term care decisions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Scale className="mt-1 h-4 w-4 text-[#b88a48]" />
                    <p>Estate plans, trusts, and legal documents that protect loved ones</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-4 w-4 text-[#b88a48]" />
                    <p>Serving Needham, Wellesley, Newton, Dedham, Dover, Brookline, and nearby communities</p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#f7f2e8] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Call</p>
                    <p className="mt-1 font-semibold text-[#182638]">{brand.phone}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f2e8] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Area</p>
                    <p className="mt-1 font-semibold text-[#182638]">{brand.area}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#e4d8c7] bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {WHY_US.map((item) => (
              <div key={item.title} className="rounded-[1.6rem] border border-[#e6dbcc] bg-[#fffdfa] p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-[#182638]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7f0] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9f7743]">Practice Areas</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#182638] md:text-5xl">
              Legal guidance for the questions families cannot afford to leave unresolved.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PRACTICE_AREAS.map((area) => (
              <Card key={area.title} className="rounded-[1.8rem] border-[#e5d8c5] bg-white shadow-sm">
                <CardContent className="p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3ead9] text-[#9f7743]">
                    <area.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[#182638]">{area.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#182638] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f2dfb8]">What working together looks like</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              A clear process for families who need calm, capable legal guidance.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PROCESS.map((item) => (
              <div key={item.step} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f2dfb8]">{item.step}</p>
                <h3 className="mt-4 font-display text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9f7743]">Service Area</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#182638]">Serving Needham and families across Greater Boston.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Families often reach out in moments of uncertainty — after a diagnosis, during a care transition, or while trying to avoid probate and long-term care mistakes. Local, experienced guidance matters.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#e5d8c5] bg-[#f9f3e8] p-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_AREAS.map((area) => (
                  <div key={area} className="rounded-2xl border border-[#e0d2bf] bg-white px-4 py-4 text-sm font-semibold text-[#182638]">
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7f0] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9f7743]">Testimonials</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#182638] md:text-5xl">What families say about working with us.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TESTIMONIALS.map((review) => (
              <Card key={review.name} className="rounded-[1.8rem] border-[#e5d8c5] bg-white shadow-sm">
                <CardContent className="p-7">
                  <Stars count={review.rating} />
                  <p className="mt-4 text-[15px] leading-7 text-slate-600">“{review.text}”</p>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="font-display text-lg font-bold text-[#182638]">{review.name}</p>
                    <p className="text-sm text-slate-500">{review.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9f7743]">FAQ</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#182638]">Common questions from families planning ahead.</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10 w-full">
            {FAQ.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-b border-[#e5d8c5]">
                <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold text-[#182638]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-7 text-slate-600">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#182638_0%,#21334a_100%)] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f2dfb8]">Free Initial Consultation</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Start with a calm conversation about what your family needs next.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Whether you are planning ahead, helping an aging parent, or navigating a difficult transition right now, we can help you understand the options and move forward with confidence.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <BookingModal
              trigger={
                <Button size="lg" className="h-14 rounded-full bg-amber-500 px-8 text-base font-bold text-[#182638] hover:bg-amber-400">
                  Schedule Consultation
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              }
              brandColor="#1b2a41"
            />
            <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/15 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10">
              <a href={phoneHref}>
                <Phone className="mr-2 h-4 w-4" />
                Call {brand.phone}
              </a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-slate-300">Confidential guidance. Family-first planning. Serving Needham and Greater Boston.</p>
        </div>
      </section>
    </div>
  );
}
