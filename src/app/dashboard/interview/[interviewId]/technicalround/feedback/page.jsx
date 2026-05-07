import Link from "next/link";
import { ChevronDown, Home, Sparkles, Trophy } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import { listTechnicalFeedback } from "@/features/interviews/services/technical-interview-service";
import { calculateOverallRating } from "@/features/interviews/utils/feedback";

export default async function TechnicalFeedbackPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { interviewId } = await params;
  const feedbackList = await listTechnicalFeedback(interviewId, email);
  const overallRating = calculateOverallRating(feedbackList);

  return (
    <main className="space-y-6">
      {feedbackList.length === 0 ? (
        <div className="surface-panel rounded-3xl p-8">
          <h1 className="text-2xl font-semibold text-white">
            No interview feedback record found
          </h1>
          <p className="mt-2 text-slate-400">Complete an interview to generate feedback.</p>
        </div>
      ) : (
        <>
          <section className="surface-panel rounded-3xl p-6 sm:p-8">
            <span className="eyebrow">
              <Trophy className="size-4" />
              Interview feedback
            </span>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold text-white">Session complete</h1>
                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Review each answer against the model response and improvement notes.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 text-center">
                <p className="text-sm font-semibold uppercase text-slate-500">Overall rating</p>
                <p className={Number(overallRating) >= 5 ? "mt-2 text-5xl font-semibold text-emerald-200" : "mt-2 text-5xl font-semibold text-red-300"}>
                  {overallRating}
                  <span className="text-xl text-slate-500">/10</span>
                </p>
              </div>
            </div>
          </section>
          {feedbackList.map((item, index) => (
            <Collapsible key={`${item.question}-${index}`} className="premium-card rounded-3xl p-4">
              <CollapsibleTrigger className="relative z-10 flex w-full justify-between gap-4 rounded-2xl px-3 py-2 text-left font-semibold text-white transition hover:bg-white/[0.055] focus:outline-none focus:ring-2 focus:ring-cyan-300/30">
                <span>{item.question}</span> <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="relative z-10">
                <div className="mt-3 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm text-slate-300">
                    <strong>Rating: </strong>
                    {item.rating}
                  </div>
                  <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                    <strong>Your Answer: </strong>
                    {item.userAns}
                  </div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                    <strong>Correct Answer: </strong>
                    {item.correctAns}
                  </div>
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-4 text-sm leading-6 text-cyan-100">
                    <Sparkles className="mr-2 inline size-4" />
                    <strong>Feedback: </strong>
                    {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <Button asChild variant="premium">
        <Link href="/dashboard">
          <Home className="size-4" />
          Go Home
        </Link>
      </Button>
    </main>
  );
}
