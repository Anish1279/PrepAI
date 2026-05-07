import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Play } from "lucide-react";

const QuestionItemCard = ({ question }) => {
  return (
    <article className="premium-card interactive-lift rounded-3xl p-5">
      <div className="relative z-10">
      <h3 className="truncate text-lg font-semibold text-white">{question?.jobPosition}</h3>
      <p className="mt-1 text-sm text-slate-400">
        {question?.jobExperience} years of experience
      </p>
      <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
        <CalendarDays className="size-4" />
        Created {question.createdAt}
      </p>

      <div className="mt-6">
        <Button asChild size="sm" className="w-full">
          <Link href={`/dashboard/pyq/${question?.mockId}`}>
            <Play className="size-3.5" />
            Review questions
          </Link>
        </Button>
      </div>
      </div>
    </article>
  );
};

export default QuestionItemCard;
