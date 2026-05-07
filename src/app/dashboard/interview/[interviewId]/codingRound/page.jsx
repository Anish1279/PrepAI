import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import CodingErrorState from "@/features/coding/components/CodingErrorState";
import { getCodingInterview } from "@/features/coding/services/coding-interview-service";
import { ArrowRight, Code2, Lightbulb, Timer } from "lucide-react";

export default async function CodingRoundPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { interviewId } = await params;
  const interviewState = await loadCodingInterview(interviewId, email);

  if (interviewState.error) {
    return (
      <CodingErrorState
        title="Could not load coding round"
        message={interviewState.error}
      />
    );
  }

  const interviewData = interviewState.data;

  return (
    <main className="space-y-6">
      <section className="surface-panel rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">
          <Code2 className="size-4" />
          Coding assessment
        </span>
        <h1 className="mt-5 text-3xl font-semibold text-white">Review the rules before you start.</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">
          The assessment includes a timed prompt, hints, an editor, and feedback after submission.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4">
            <div className="premium-card rounded-3xl p-6">
              <div className="relative z-10 space-y-5">
              <p className="page-kicker">Assessment context</p>
              <h2 className="text-lg text-slate-300">
                <strong className="text-cyan-200">Job role: </strong>
                {interviewData?.jobPosition}
              </h2>
              <h2 className="text-lg text-slate-300">
                <strong className="text-cyan-200">Programming language: </strong>
                {interviewData?.language}
              </h2>
              <h2 className="text-lg text-slate-300">
                <strong className="text-cyan-200">Experience: </strong>
                {interviewData?.jobExperience}
                {" "}years
              </h2>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100/80">
                <Lightbulb className="mb-3 size-5 text-amber-100" />
                <strong className="text-amber-100">Hints: </strong>
                It contains a hint which you may use when you are stuck in question
              </div>
              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-sm leading-6 text-cyan-100/80">
                <Timer className="mb-3 size-5 text-cyan-100" />
                <strong className="text-cyan-100">Time limit: </strong>
                There will be a timer on the top right corner of the interface.
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 text-sm leading-6 text-slate-300">
                <strong className="text-white">Note: </strong>
                Save your code before submission so it can be evaluated.
              </div>
            </div>
        </section>
        <section className="surface-panel hidden overflow-hidden rounded-3xl p-3 sm:block">
          <Image src="/pic.png" width={1900} height={818} className="h-full min-h-[420px] w-full rounded-2xl object-cover object-left" alt="Coding assessment interface preview" />
        </section>
      </div>
      <div className="flex justify-end">
        <Button asChild size="lg" variant="premium">
          <Link href={`/dashboard/interview/${interviewId}/codingRound/start`}>
            Start Assessment
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}

async function loadCodingInterview(interviewId, email) {
  try {
    return { data: await getCodingInterview(interviewId, email), error: "" };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Could not load this coding round. Please try again.",
    };
  }
}
