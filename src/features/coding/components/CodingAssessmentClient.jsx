"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lightbulb, LoaderCircle, TerminalSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu } from "@headlessui/react";
import CodeEditor from "@/features/coding/components/CodeEditor";
import Timer from "@/features/coding/components/Timer";
import { apiRequest } from "@/lib/api/client";
import { CODING_ASSESSMENT_MINUTES } from "@/constants/interviews";

export default function CodingAssessmentClient({ interview, interviewId }) {
  const [userSolution, setUserSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const submitted = useRef(false);
  const router = useRouter();
  const editorLanguage = useMemo(
    () => String(interview.language ?? "javascript").trim().toLowerCase(),
    [interview.language]
  );
  const hasSolution = userSolution.trim().length > 0;

  const submitAnswer = useCallback(async () => {
    if (submitted.current) {
      return;
    }

    submitted.current = true;
    setLoading(true);

    try {
      await apiRequest(`/api/interviews/coding/${interviewId}/submissions`, {
        method: "POST",
        body: {
          question: interview.question,
          correctAns: interview.codeSolution,
          userSolution: userSolution ?? "",
        },
      });

      toast.success("User answer recorded successfully!!");
      router.replace(`/dashboard/interview/${interviewId}/codingRound/feedback`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit your code. Please try again."
      );
      submitted.current = false;
      setLoading(false);
    }
  }, [interview.codeSolution, interview.question, interviewId, router, userSolution]);

  const handleTimeUp = useCallback(
    (isTimeUp) => {
      if (isTimeUp) {
        submitAnswer();
      }
    },
    [submitAnswer]
  );

  const handleManualSubmit = () => {
    if (hasSolution) {
      submitAnswer();
    }
  };

  return (
    <main className="space-y-5">
      <section className="surface-panel rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="page-kicker">Coding assessment</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{interview.question?.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="status-pill">
              <TerminalSquare className="size-3.5" />
              {editorLanguage}
            </span>
            <Timer
              initialMinutes={CODING_ASSESSMENT_MINUTES}
              initialSeconds={0}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="surface-panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold uppercase text-slate-500">
              Level: <span className="text-cyan-200">{interview.question?.difficulty}</span>
            </h2>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button as={Button} variant="outline">
                <Lightbulb className="h-4 mr-1 " />
                Hint
              </Menu.Button>
              <Menu.Items className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-2xl border border-white/10 bg-slate-950/95 p-3 text-sm leading-6 text-slate-300 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div>{interview.question?.hint}</div>
              </Menu.Items>
            </Menu>
          </div>
          <div className="my-6 h-px bg-white/10" />
          <div className="space-y-7 text-sm leading-7 text-slate-300">
            <p>{interview.question?.description}</p>

            <div>
              <strong className="text-white">Input Format</strong>
              <p className="mt-2 text-slate-400">{interview.question?.input_format}</p>
            </div>
            <div>
              <strong className="text-white">Output Format</strong>
              <p className="mt-2 text-slate-400">{interview.question?.output_format}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Example</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                  <strong className="text-slate-200">Input</strong>
                  <div className="mt-2 text-slate-400">
                    {interview.question?.sample_input?.map((input, index) => (
                      <p key={`${input}-${index}`}>{input}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                  <strong className="text-slate-200">Output</strong>
                  <div className="mt-2 text-slate-400">
                    {interview.question?.sample_output?.map((output, index) => (
                      <p key={`${output}-${index}`}>{output}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Constraints</h2>
              <p className="mt-2 text-slate-400">{interview.question?.constraints}</p>
            </div>
          </div>
        </section>

        <section className="surface-panel rounded-3xl p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3 px-2">
            <span className="status-pill">{editorLanguage}</span>
            <span className="text-xs font-medium text-slate-500">Monaco editor</span>
          </div>
          <CodeEditor
            onValueChange={setUserSolution}
            language={editorLanguage}
          />
          <div className="mt-4 flex justify-end">
            <Button
              variant="premium"
              disabled={loading || !hasSolution}
              onClick={handleManualSubmit}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                  Submitting
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Submit Code
                </>
              )}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
