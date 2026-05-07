"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, BrainCircuit, Mic2, Code2 } from "lucide-react";

export default function Card3D() {
  const router = useRouter();

  return (
    <div className="card3d-parent">
      <div className="card3d">
        {/* Logo circles in top-right */}
        <div className="card3d-logo">
          <span className="card3d-circle card3d-circle1" />
          <span className="card3d-circle card3d-circle2" />
          <span className="card3d-circle card3d-circle3" />
          <span className="card3d-circle card3d-circle4" />
          <span className="card3d-circle card3d-circle5">
            <Sparkles className="card3d-logo-icon" />
          </span>
        </div>

        {/* Glass overlay */}
        <div className="card3d-glass" />

        {/* Content */}
        <div className="card3d-content">
          <span className="card3d-title">PrepAI Mock Interview</span>
          <span className="card3d-text">
            AI-powered mock interviews with real-time feedback, coding rounds & voice practice
          </span>
        </div>

        {/* Bottom bar */}
        <div className="card3d-bottom">
          <div className="card3d-feature-icons">
            <button
              className="card3d-feature-btn"
              aria-label="AI Brain"
              title="Adaptive AI Interviews"
            >
              <BrainCircuit className="card3d-feature-svg" />
            </button>
            <button
              className="card3d-feature-btn"
              aria-label="Voice Practice"
              title="Voice-First Practice"
            >
              <Mic2 className="card3d-feature-svg" />
            </button>
            <button
              className="card3d-feature-btn"
              aria-label="Coding Rounds"
              title="Coding Assessments"
            >
              <Code2 className="card3d-feature-svg" />
            </button>
          </div>
          <div className="card3d-view-more">
            <button
              className="card3d-view-more-btn"
              onClick={() => router.push("/dashboard")}
            >
              Start now
            </button>
            <svg
              className="card3d-view-more-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
