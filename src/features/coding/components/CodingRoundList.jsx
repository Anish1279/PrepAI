"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, Code2, Play } from "lucide-react";

const CodingRoundList = ({ interviews = [], error = "" }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-kicker">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Coding rounds
          </h2>
        </div>
        <span className="status-pill">
          <Code2 className="size-3.5" />
          {interviews.length} saved
        </span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-medium text-red-200">
          Could not load coding rounds. Try refreshing.
        </div>
      ) : interviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => (
            <article
              key={interview.mockId}
              className="premium-card interactive-lift rounded-3xl p-5"
            >
              <div className="relative z-10 flex min-h-[185px] min-w-0 flex-col justify-between">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-lg font-semibold text-white">
                    {interview?.jobPosition}
                  </h3>
                  {interview?.language && (
                    <span className="status-pill shrink-0">
                      {interview.language}
                    </span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500">
                      Experience
                    </p>
                    <p className="mt-1 font-medium text-slate-200">
                      {interview?.jobExperience} years
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-xs font-medium uppercase text-slate-500">
                      <CalendarDays className="size-3.5" />
                      Created
                    </p>
                    <p className="mt-1 font-medium text-slate-200">
                      {interview?.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Link href={`/dashboard/interview/${interview?.mockId}/codingRound/feedback`}>
                    Feedback
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="w-full"
                >
                  <Link href={`/dashboard/interview/${interview?.mockId}/codingRound`}>
                    <Play className="size-3.5" />
                    Start
                  </Link>
                </Button>
              </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/12 bg-white/[0.035] p-8 text-sm text-slate-500">
          No coding rounds yet. Generate one from the action tile above.
        </div>
      )}
    </section>
  );
};

export default CodingRoundList;
