"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, LoaderCircle, TerminalSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/client";

const AddNewCodingRound = () => {
  const [openDialog2, setOpenDialog2] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [language, setLanguage] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interview = await apiRequest("/api/interviews/coding", {
        method: "POST",
        body: { jobPosition, language, jobExperience },
      });

      setOpenDialog2(false);
      setJobPosition("");
      setLanguage("");
      setJobExperience("");
      router.push(`/dashboard/interview/${interview.mockId}/codingRound`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create coding round. Please try again."
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
        onClick={() => setOpenDialog2(true)}
      >
        <div className="relative z-10 flex min-h-[190px] flex-col justify-between">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <Code2 className="size-6" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-white">Coding Round</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Create a timed coding challenge with hints, Monaco editing, and AI review.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm font-semibold text-emerald-200">
            <span>Generate challenge</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </button>

      <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <TerminalSquare className="size-6" />
            </div>
            <DialogTitle>Configure your coding assessment</DialogTitle>
            <DialogDescription>
              Choose the target role, programming language, and experience band.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmitCode} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Job role
              </label>
              <Input
                className="mt-2"
                placeholder="Ex. Software Developer"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-200">
                Programming Language
              </label>
              <Input
                className="mt-2"
                placeholder="Ex. Java, Cpp or Python"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-200">
                Years of Experience
              </label>
              <Input
                className="mt-2"
                placeholder="Ex. 4"
                type="number"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog2(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} variant="premium">
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" />
                    Generating challenge
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewCodingRound;
