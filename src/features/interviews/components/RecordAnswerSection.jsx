"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Camera, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { WebCamContext } from "@/features/interviews/context/webcam-context";
import { apiRequest } from "@/lib/api/client";
import { MIN_ANSWER_LENGTH } from "@/constants/interviews";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > MIN_ANSWER_LENGTH) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast("Error starting recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob, "answer.webm");

      const result = await apiRequest("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      });

      setUserAnswer((prevAnswer) => `${prevAnswer} ${result.transcription}`.trim());
    } catch (error) {
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserAnswer = async () => {
    try {
      setLoading(true);
      await apiRequest(`/api/interviews/technical/${interData?.mockId}/answers`, {
        method: "POST",
        body: {
          question: mockInterviewQuestion[activeQuestionIndex]?.Question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
          userAns: userAnswer,
        },
      });

      toast("User Answer recorded successfully");
      setUserAnswer("");
    } catch (error) {
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="surface-panel flex flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="page-kicker">Answer capture</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Record your response</h2>
        </div>
        <span className="status-pill">{isRecording ? "Recording" : "Ready"}</span>
      </div>

      <div className="mt-6 flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image src={"/cam.png"} width={220} height={220} alt="Camera placeholder" className="opacity-70" />
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button onClick={() => setWebCamEnabled((prev) => !prev)} variant="outline">
            <Camera className="size-4" />
            {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
          </Button>
        <Button
          variant={isRecording ? "destructive" : "premium"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {isRecording ? (
            <>
              <Square className="size-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="size-4" />
              Record Answer
            </>
          )}
        </Button>
      </div>
      {loading && <p className="mt-4 text-sm text-slate-500">Processing your answer...</p>}
    </section>
  );
};

export default RecordAnswerSection;
