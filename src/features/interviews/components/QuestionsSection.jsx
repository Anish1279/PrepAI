"use client";

import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const textToSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech.");
    }
  };

  return (
    mockInterviewQuestion && (
      <section className="surface-panel flex min-h-[520px] flex-col justify-between rounded-3xl p-5 sm:p-6">
        <div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
          {mockInterviewQuestion.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex h-10 items-center justify-center rounded-xl border text-xs font-semibold transition",
                activeQuestionIndex === index
                  ? "border-cyan-300/40 bg-cyan-300 text-slate-950"
                  : "border-white/10 bg-white/[0.055] text-slate-400"
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <h2 className="my-8 text-balance text-2xl font-semibold leading-tight text-white">
          {mockInterviewQuestion[activeQuestionIndex]?.Question}
        </h2>

        <Button
          type="button"
          variant="outline"
          onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}
        >
          <Volume2 className="size-4" />
          Listen to question
        </Button>
        </div>

        <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <h2 className="flex gap-2 items-center text-cyan-100">
            <Lightbulb className="size-5" />
            <strong>Note:</strong>
          </h2>
          <p className="my-2 text-sm leading-6 text-cyan-100/75">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </p>
        </div>
      </section>
    )
  );
};

export default QuestionSection;
