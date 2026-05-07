"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Layers3,
  Mic2,
  Play,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Card3D from "@/components/Card3D";
import Loader3D from "@/components/Loader3D";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: BrainCircuit,
    title: "Adaptive AI interviews",
    copy: "Generate role-specific interviews with calibrated prompts, follow-ups, and feedback loops.",
  },
  {
    icon: Code2,
    title: "Coding rounds that feel real",
    copy: "Practice timed assessments with Monaco, hints, submissions, and AI evaluation.",
  },
  {
    icon: Mic2,
    title: "Voice-first practice",
    copy: "Record answers, transcribe responses, and keep the interview flow natural.",
  },
  {
    icon: ShieldCheck,
    title: "Secure auth workflows",
    copy: "A focused preparation workspace protected by session and CSRF-aware flows.",
  },
];



const steps = [
  "Describe the target role and stack",
  "Practice under realistic pressure",
  "Review AI feedback and tighten answers",
];

export default function PrepAILanding() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 90, damping: 18 };

  return (
    <main className="min-h-screen overflow-hidden text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="section-shell pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <Link href="/" className="flex items-center gap-3" aria-label="PrepAI home">
              <span className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
                <Sparkles className="size-5" />
              </span>
              <span className="text-lg font-semibold text-white">PrepAI</span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {["Platform", "Workflow", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button variant="premium" onClick={() => router.push("/dashboard")}>
                Launch
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-[86svh] items-center overflow-hidden pb-12 pt-28">
        <div className="absolute inset-x-0 bottom-0 top-[95px] overflow-hidden">
          <Image
            src="/ChatGPT Image May 7, 2026, 12_37_29 AM.png"
            alt="PrepAI coding interview interface preview"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.3),rgba(5,7,13,0.6)_56%,#05070d_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#05070d)]" />
        </div>

        <motion.div
          className="section-shell relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: reduceMotion ? {} : { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
        >
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} transition={transition} className="eyebrow">
              <WandSparkles className="size-4" />
              AI-native interview command center
            </motion.div>
            <motion.h1
              variants={fadeUp}
              transition={transition}
              className="mt-6 text-balance text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
            >
              PrepAI
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={transition}
              className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl"
            >
              A premium dark workspace for mock interviews, coding rounds, question prep,
              and AI feedback that helps candidates practice like the real day is already here.
            </motion.p>
            <motion.div variants={fadeUp} transition={transition} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="premium" onClick={() => router.push("/dashboard")}>
                Start practicing
                <ArrowRight className="size-5" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-up">
                  <Play className="size-5" />
                  Create account
                </Link>
              </Button>
            </motion.div>
          </div>


          <motion.div
            variants={fadeUp}
            transition={transition}
            className="hidden items-center justify-center lg:flex"
          >
            <Card3D />
          </motion.div>
        </motion.div>
      </section>

      <section id="platform" className="section-shell py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                className="premium-card interactive-lift rounded-3xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.05 }}
              >
                <div className="relative z-10">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="mt-6 text-lg font-semibold text-white">{feature.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{feature.copy}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="page-kicker">Workflow</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              From nervous practice to repeatable interview rhythm.
            </h2>
            <p className="mt-5 max-w-xl text-pretty leading-7 text-slate-400">
              PrepAI turns preparation into a guided loop: generate context,
              practice with constraints, then review precise improvement signals.
            </p>
            <div className="mt-12 hidden lg:block opacity-60 hover:opacity-100 transition-opacity duration-500">
              <Loader3D />
            </div>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className="surface-panel flex items-center gap-4 rounded-2xl p-5"
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.07 }}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{step}</p>
                  <p className="mt-1 text-sm text-slate-500">Designed for low cognitive load and fast repetition.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section-shell py-16 pb-24">
        <div className="surface-panel grid gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="eyebrow">
              <BadgeCheck className="size-4" />
              Portfolio-grade preparation suite
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
              Build the habit before the interview builds the pressure.
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Technical rounds", "Coding feedback", "Question banks", "Progress review"].map((item) => (
                <span key={item} className="status-pill">
                  <Layers3 className="size-3.5" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" variant="premium" onClick={() => router.push("/dashboard")}>
              Open dashboard
              <ArrowRight className="size-5" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/howit">
                <TimerReset className="size-5" />
                See workflow
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
