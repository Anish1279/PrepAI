import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Sparkles } from "lucide-react";

export const metadata = {
  title: "How It Works - PrepAI",
  description: "Learn how PrepAI turns interview preparation into a repeatable workflow.",
};

const steps = [
  {
    title: "Prepare the target context",
    copy: "Select the interview type and describe the job role, stack, company, and experience band.",
  },
  {
    title: "Practice inside a focused session",
    copy: "Run technical questions, timed coding challenges, voice answers, and hints without leaving the workspace.",
  },
  {
    title: "Review feedback and repeat",
    copy: "Study AI feedback, compare model answers, and use the next session to tighten weak areas.",
  },
];

const HowItWorks = () => {
  return (
    <main className="space-y-8">
      <section className="surface-panel rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">
          <Sparkles className="size-4" />
          Guided workflow
        </span>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight text-white">
          How PrepAI turns preparation into a repeatable loop.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          The product is designed around short, focused reps: generate,
          practice, review, and improve without losing context.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="premium-card rounded-3xl p-6">
            <div className="relative z-10">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                <CheckCircle2 className="size-5" />
              </span>
              <p className="mt-6 text-sm font-semibold uppercase text-slate-500">Step {index + 1}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="surface-panel rounded-3xl p-4 sm:p-6">
        <Accordion type="single" collapsible className="divide-y divide-white/10">
          {steps.map((step, index) => (
            <AccordionItem value={`item-${index + 1}`} key={step.title} className="border-white/10">
              <AccordionTrigger className="text-base font-semibold text-white hover:no-underline">
                {step.title}
              </AccordionTrigger>
              <AccordionContent className="leading-7 text-slate-400">
                {step.copy}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default HowItWorks;
