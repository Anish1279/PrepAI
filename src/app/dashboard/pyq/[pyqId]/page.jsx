import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import { getQuestionSet } from "@/features/questions/services/question-service";
import { BookOpenCheck, Sparkles } from "lucide-react";

export default async function QuestionSetPage({ params }) {
  const email = await requireCurrentUserEmail();

  const { pyqId } = await params;
  const questionSet = await getQuestionSet(pyqId, email);

  if (!questionSet.questions.length) {
    return (
      <div className="surface-panel rounded-3xl p-8">
        <h1 className="text-2xl font-semibold text-white">No questions found</h1>
        <p className="mt-2 text-slate-400">This question set does not have generated questions yet.</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <section className="surface-panel rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">
          <Sparkles className="size-4" />
          Question review
        </span>
        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-white">Generated interview questions</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Expand each prompt to compare the recommended answer and refine your response.
            </p>
          </div>
          <span className="status-pill">
            <BookOpenCheck className="size-3.5" />
            {questionSet.questions.length} prompts
          </span>
        </div>
      </section>

      <section className="surface-panel rounded-3xl p-4 sm:p-6">
      <Accordion type="single" collapsible className="divide-y divide-white/10">
        {questionSet.questions.map((item, index) => (
          <AccordionItem value={`item-${index + 1}`} key={`${item?.Question}-${index}`} className="border-white/10">
            <AccordionTrigger className="text-base font-semibold text-white hover:no-underline">
              {item?.Question}?
            </AccordionTrigger>
            <AccordionContent className="leading-7 text-slate-400">{item?.Answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </section>
    </main>
  );
}
