import Link from "next/link";
import FormatCode from "@/features/coding/components/FormatCode";
import CodingErrorState from "@/features/coding/components/CodingErrorState";
import { Button } from "@/components/ui/button";
import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import { getLatestCodingFeedback } from "@/features/coding/services/coding-interview-service";
import { isAppError } from "@/lib/errors";
import { CheckCircle2, Home, Sparkles, Trophy } from "lucide-react";

const feedbackKeys = [
  "correctness",
  "approach",
  "efficiency",
  "code_quality",
  "optimization",
  "overall_feedback",
];

export default async function CodingFeedbackPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { interviewId } = await params;
  const feedbackState = await loadFeedback(interviewId, email);

  if (feedbackState.error) {
    return (
      <CodingErrorState
        title="Could not load coding feedback"
        message={feedbackState.error}
      />
    );
  }

  if (!feedbackState.data) {
    return (
      <div className="surface-panel rounded-3xl p-8">
        <h1 className="text-2xl font-semibold text-white">
          No coding feedback record found.
        </h1>
        <p className="mt-2 text-slate-400">Submit a coding assessment to generate feedback.</p>
        <Button asChild className="mt-6" variant="premium">
          <Link href="/dashboard">
            <Home className="size-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const feedback = feedbackState.data;

  return (
    <main className="space-y-6">
      <section className="surface-panel rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">
          <Trophy className="size-4" />
          Coding feedback
        </span>
        <h1 className="mt-5 text-4xl font-semibold text-white">
          Challenge complete
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">
          Review correctness, approach, efficiency, quality, and optimization guidance.
        </p>
      </section>

      <section className="surface-panel rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-white">
          Personalized feedback
        </h2>

        <div className="mt-6 space-y-5 text-slate-400">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 leading-7">
            <p>{feedback.solutionFeedback?.message}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {feedbackKeys.map((key) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={key}>
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 className="size-4 text-emerald-200" />
                  {formatFeedbackLabel(key)}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feedback.solutionFeedback?.[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-3xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
          <Sparkles className="size-5 text-cyan-200" />
          Correct solution
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <FormatCode code={feedback.correctAnswer?.code} language={feedback.language} />
          </div>

          <div className="flex flex-col gap-4 text-sm leading-7 text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <span className="font-semibold text-white">Explanation: </span>
              <span>{feedback.correctAnswer?.explanation}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <span className="font-semibold text-white">Time Complexity: </span>
              <span>{feedback.correctAnswer?.time_complexity}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <span className="font-semibold text-white">Other Approach: </span>
              <span>{feedback.correctAnswer?.other_approach}</span>
            </div>
          </div>
        </div>
      </section>

      <Button asChild variant="premium">
        <Link href="/dashboard">
          <Home className="size-4" />
          Go to Dashboard
        </Link>
      </Button>
    </main>
  );
}

async function loadFeedback(interviewId, email) {
  try {
    return { data: await getLatestCodingFeedback(interviewId, email), error: "" };
  } catch (error) {
    if (isAppError(error) && error.statusCode === 404) {
      return { data: null, error: "" };
    }

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Could not load coding feedback. Please try again.",
    };
  }
}

function formatFeedbackLabel(key) {
  return key.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
