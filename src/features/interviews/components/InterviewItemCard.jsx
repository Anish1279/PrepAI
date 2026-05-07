import React from 'react'
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { CalendarDays, Play, Sparkles } from 'lucide-react';

const InterviewItemCard = ({interview}) => {
  return (
    <article className="premium-card interactive-lift rounded-3xl p-5">
        <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className='truncate text-lg font-semibold text-white' >{interview?.jobPosition}</h3>
            <p className='mt-1 text-sm text-slate-400' >{interview?.jobExperience} years of experience</p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
            <Sparkles className="size-5" />
          </span>
        </div>
        <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
          <CalendarDays className="size-4" />
          Created {interview.createdAt}
        </p>

        <div className='mt-6 grid grid-cols-2 gap-3' >
            <Button asChild size="sm" variant="outline" className="w-full" >
              <Link href={`/dashboard/interview/${interview?.mockId}/technicalround/feedback`}>Feedback</Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href={`/dashboard/interview/${interview?.mockId}/technicalround`}>
                <Play className="size-3.5" />
                Start
              </Link>
            </Button>
        </div>
        </div>
    </article>

  )
}

export default InterviewItemCard
