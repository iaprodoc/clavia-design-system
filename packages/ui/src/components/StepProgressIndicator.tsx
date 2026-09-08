import type { ReactNode } from "react";

const ringRadius = 22;

export type StepProgressIndicatorSize = "compact" | "default";

export interface StepProgressIndicatorProps {
  children: ReactNode;
  label: string;
  size?: StepProgressIndicatorSize;
  value: number;
}

export function StepProgressIndicator({
  children,
  label,
  size = "default",
  value,
}: StepProgressIndicatorProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <span
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      aria-valuetext={`${normalizedValue}% concluído`}
      className="clv-step-progress-indicator"
      data-size={size}
      role="progressbar"
    >
      <svg aria-hidden="true" className="clv-step-progress-indicator__ring" viewBox="0 0 48 48">
        <circle
          className="clv-step-progress-indicator__outline"
          cx="24"
          cy="24"
          fill="none"
          r={ringRadius}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span aria-hidden="true" className="clv-step-progress-indicator__content">
        {children}
      </span>
    </span>
  );
}
