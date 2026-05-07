"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, BookOpenCheck, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/client";

const AddQuestions = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (setState) => (e) => setState(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionSet = await apiRequest("/api/questions", {
        method: "POST",
        body: { jobPosition, jobDesc, typeQuestion, company, jobExperience },
      });

      setOpenDialog(false);
      router.push(`/dashboard/pyq/${questionSet.mockId}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not add new questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="premium-card interactive-lift animated-border group w-full rounded-3xl p-6 text-left"
        onClick={() => setOpenDialog(true)}
      >
        <div className="relative z-10 flex min-h-[190px] flex-col justify-between">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
              <BookOpenCheck className="size-6" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-white">Question Set</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Generate company, stack, and experience-aware questions with reference answers.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm font-semibold text-amber-200">
            <span>Create set</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </button>

      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
  <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
    <DialogHeader>
      <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
        <Sparkles className="size-6" />
      </div>
      <DialogTitle>Design a question set</DialogTitle>
      <DialogDescription>
        PrepAI will tailor the question bank to the role, stack, company, and seniority.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-200">Job role</label>
        <Input
          className="mt-1"
          value={jobPosition}
          placeholder="Ex. Full Stack Developer"
          required
          onChange={handleInputChange(setJobPosition)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-200">Job description and tech stack</label>
        <Textarea
          className="mt-1"
          value={jobDesc}
          placeholder="Ex. React, Angular, Nodejs, MySQL, NoSQL, Python"
          required
          onChange={handleInputChange(setJobDesc)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-200">Type of questions</label>
        <Input
          className="mt-1"
          value={typeQuestion}
          placeholder="Ex. CPP, Leetcode, Domain based"
          required
          onChange={handleInputChange(setTypeQuestion)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-200">Target company</label>
        <Input
          className="mt-1"
          value={company}
          placeholder="Ex. Microsoft, Apple, Google"
          required
          onChange={handleInputChange(setCompany)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-200">Years of experience</label>
        <Input
          className="mt-1"
          type="number"
          value={jobExperience}
          placeholder="Ex. 5"
          max="50"
          required
          onChange={handleInputChange(setJobExperience)}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} variant="premium">
          {loading ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              Generating set
            </>
          ) : (
            "Generate Questions"
          )}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default AddQuestions;
