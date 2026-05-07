import React from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton"
import { BrainCircuit } from "lucide-react";


const InterviewList = ({ interviews = [] }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-kicker">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Technical rounds</h2>
        </div>
        <span className="status-pill">
          <BrainCircuit className="size-3.5" />
          {interviews.length} saved
        </span>
      </div>
  
      {interviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => (
            <InterviewItemCard key={interview.mockId} interview={interview} />
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

export default InterviewList;
