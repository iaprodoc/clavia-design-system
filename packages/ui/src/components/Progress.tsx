"use client";

import { useEffect, useState } from "react";

export type ProgressVariant = "circular" | "linear";

const CIRCULAR_PROGRESS_RADIUS = 20;
const CIRCULAR_PROGRESS_CIRCUMFERENCE = 2 * Math.PI * CIRCULAR_PROGRESS_RADIUS;

export interface ProgressProps {
  label: string;
  value: number;
  variant?: ProgressVariant;
}

export function Progress({ label, value, variant = "linear" }: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    setAnimatedValue(normalizedValue);
  }, [normalizedValue]);

  if (variant === "circular") {
    const dashOffset = CIRCULAR_PROGRESS_CIRCUMFERENCE * (1 - animatedValue / 100);

    return (
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className="clv-progress clv-progress--circular"
        role="progressbar"
      >
        <svg aria-hidden="true" className="clv-progress__circular-ring" viewBox="0 0 48 48">
          <circle
            className="clv-progress__circular-track"
            cx="24"
            cy="24"
            r={CIRCULAR_PROGRESS_RADIUS}
          />
          <circle
            className="clv-progress__circular-indicator"
            cx="24"
            cy="24"
            r={CIRCULAR_PROGRESS_RADIUS}
            strokeDasharray={CIRCULAR_PROGRESS_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <span aria-hidden="true" className="clv-progress__circular-value">
          {normalizedValue}%
        </span>
      </div>
    );
  }

  return (
    <div className="clv-progress">
      <div className="clv-progress__meta">
        <span className="clv-progress__label">{label}</span>
        <span className="clv-progress__value">{normalizedValue}%</span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className="clv-progress__track"
        role="progressbar"
      >
        <div className="clv-progress__indicator" style={{ width: `${animatedValue}%` }} />
      </div>
    </div>
  );
}
