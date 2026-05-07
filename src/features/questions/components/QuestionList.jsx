"use client";

import React, { useEffect } from "react";
import QuestionItemCard from "./QuestionItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BookOpenCheck } from "lucide-react";

const QuestionList = ({ questions = [], error = "" }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-kicker">Saved sets</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Question banks</h2>
        </div>
        <span className="status-pill">
          <BookOpenCheck className="size-3.5" />
          {questions.length} saved
        </span>
      </div>
      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-medium text-red-200">
          Could not load question sets. Please refresh and try again.
        </div>
      ) : questions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {questions.map((question) => (
              <QuestionItemCard key={question.mockId} question={question} />
            ))}
          </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/12 bg-white/[0.035] p-8">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-20 w-full" />
        </div>
      )}
    </section>
  );
};
export default QuestionList;
