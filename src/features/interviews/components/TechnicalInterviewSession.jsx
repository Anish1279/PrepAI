"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import QuestionSection from "@/features/interviews/components/QuestionsSection";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const RecordAnswerSection = dynamic(
  () => import("@/features/interviews/components/RecordAnswerSection"),
  { ssr: false }
);

export default function TechnicalInterviewSession({ interview }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const questions = interview.questions;
  const isLastQuestion = activeQuestionIndex === questions.length - 1;

  return (
    <main className="space-y-6">
      <section className="surface-panel rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="page-kicker">Live session</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Technical interview</h1>
          </div>
          <span className="status-pill">
            Question {activeQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <QuestionSection
          mockInterviewQuestion={questions}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={questions}
          activeQuestionIndex={activeQuestionIndex}
          interData={interview}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            variant="outline"
          >
            <ArrowLeft className="size-4" />
            Previous Question
          </Button>
        )}
        {!isLastQuestion && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            variant="premium"
          >
            Next Question
            <ArrowRight className="size-4" />
          </Button>
        )}
        {isLastQuestion && (
          <Button asChild variant="premium">
            <Link href={`/dashboard/interview/${interview.mockId}/technicalround/feedback`}>
              <CheckCircle2 className="size-4" />
              End Interview
            </Link>
          </Button>
        )}
      </div>
    </main>
  );
}
