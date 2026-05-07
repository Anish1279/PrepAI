import React from "react";
import AddQuestions from '@/features/questions/components/AddQuestions'
import QuestionList from "@/features/questions/components/QuestionList";
import { requireCurrentUserEmail } from "@/features/auth/services/session-service";
import { listQuestionSets } from "@/features/questions/services/question-service";
import { BookOpenCheck, Sparkles } from "lucide-react";

const Questions = async () => {
  const email = await requireCurrentUserEmail();

  let questions = [];
  let questionsError = "";

  try {
    questions = await listQuestionSets(email);
  } catch (error) {
    questionsError =
      error instanceof Error
        ? error.message
        : "Could not load question sets. Please refresh and try again.";
  }

  return (
    <div className="space-y-8">
      <section className="surface-panel rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">
          <Sparkles className="size-4" />
          Question intelligence
        </span>
        <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight text-white">
              Build targeted question banks before the interview window opens.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Generate company, role, and stack-specific preparation sets with concise AI answers.
            </p>
          </div>
          <span className="status-pill self-start lg:self-auto">
            <BookOpenCheck className="size-3.5" />
            {questions.length} sets
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" >
        <AddQuestions />
      </div>

      <QuestionList questions={questions} error={questionsError} />
    </div>
  );
};

export default Questions;
