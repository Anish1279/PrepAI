"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Webcam from "react-webcam";
import { ArrowRight, BriefcaseBusiness, Lightbulb, Video, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebCamContext } from "@/features/interviews/context/webcam-context";

export default function TechnicalInterviewPreview({ interview }) {
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

  return (
    <main className="space-y-6">
      <section className="surface-panel rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">
          <BriefcaseBusiness className="size-4" />
          Technical interview setup
        </span>
        <h1 className="mt-5 text-3xl font-semibold text-white">Get your interview room ready.</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">
          Review the generated context, enable your webcam if useful, then start the session.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="premium-card rounded-3xl p-6">
            <div className="relative z-10 space-y-5">
            <p className="text-sm font-semibold uppercase text-slate-500">Interview context</p>
            <h2 className="text-lg text-slate-300">
              <strong className="text-cyan-200 ">Job role: </strong>
              {interview?.jobPosition}
            </h2>
            <h2 className="text-lg text-slate-300">
              <strong className="text-cyan-200">Job stack: </strong>
              {interview?.jobDesc}
            </h2>
            <h2 className="text-lg text-slate-300">
              <strong className="text-cyan-200">Experience: </strong>
              {interview?.jobExperience}
              {" "}years
            </h2>
            </div>
          </div>
          <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6">
            <h2 className="flex gap-2 items-center text-amber-100">
              <Lightbulb className="size-5" />
              <strong>Session note</strong>
            </h2>
            <p className="mt-3 leading-7 text-amber-100/75">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </p>
          </div>
        </section>
        <section className="surface-panel rounded-3xl p-5">
          {webCamEnabled ? (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                className="aspect-video w-full object-cover"
                mirrored={true}
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-3xl border border-dashed border-white/12 bg-white/[0.035]">
              <WebcamIcon className="size-24 text-slate-600" />
            </div>
          )}
          <Button
            onClick={() => setWebCamEnabled((prev) => !prev)}
            variant="outline"
            className="mt-4 w-full"
          >
            <Video className="size-4" />
            {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
          </Button>
        </section>
      </div>
      <div className="flex justify-end">
        <Button asChild size="lg" variant="premium">
          <Link href={`/dashboard/interview/${interview.mockId}/technicalround/start`}>
            Start Interview
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
