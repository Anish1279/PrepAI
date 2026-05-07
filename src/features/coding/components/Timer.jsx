"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const Timer = ({ initialMinutes, initialSeconds, onTimeUp }) => {
  const initialTimeLeft = useMemo(
    () => {
      const minutes = Number(initialMinutes);
      const seconds = Number(initialSeconds);
      const totalSeconds = minutes * 60 + seconds;

      return Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
    },
    [initialMinutes, initialSeconds]
  );
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const intervalRef = useRef(null);
  const hasCalledTimeUp = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    setTimeLeft(initialTimeLeft);
    hasCalledTimeUp.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (initialTimeLeft === 0) {
      hasCalledTimeUp.current = true;
      onTimeUpRef.current?.(true);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          if (!hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            onTimeUpRef.current?.(true);
          }

          return 0;
        }

        return currentTimeLeft - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [initialTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase text-slate-500">Time</span>
        <p className="font-mono text-lg font-semibold text-white">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      </div>
    </div>
  );
};

export default Timer;
