import type { KeyboardEvent, ReactNode } from "react";

import { StepProgressIndicator } from "./StepProgressIndicator";
import { Tooltip } from "./Tooltip";

export type StepStatus = "available" | "blocked" | "completed" | "current";
export type StepperOrientation = "horizontal" | "vertical";
export type StepperSize = "compact" | "default";
export type StepperVariant = "default" | "phase-navigation";

export interface StepperItem {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  number: ReactNode;
  status: StepStatus;
  tooltipLabel?: string;
}

export interface StepperProps {
  ellipsis?: boolean;
  label?: string;
  orientation?: StepperOrientation;
  /**
   * Called when a non-blocked step is activated. Without it, the component
   * remains a static progress summary.
   */
  onStepChange?: (step: StepperItem) => void;
  progress?: number;
  showStatus?: boolean;
  size?: StepperSize;
  steps: readonly StepperItem[];
  variant?: StepperVariant;
}

const statusLabel: Record<StepStatus, string> = {
  available: "Disponível",
  blocked: "Bloqueada",
  completed: "Concluída",
  current: "Em andamento",
};

export function Stepper({
  ellipsis = false,
  label = "Etapas",
  orientation = "vertical",
  onStepChange,
  progress,
  showStatus = true,
  size = "default",
  steps,
  variant = "default",
}: StepperProps) {
  const normalizedProgress =
    progress === undefined ? undefined : Math.min(100, Math.max(0, progress));

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];

    if (!keys.includes(event.key)) {
      return;
    }

    const controls = Array.from(
      event.currentTarget
        .closest<HTMLElement>(".clv-stepper")
        ?.querySelectorAll<HTMLButtonElement>("[data-stepper-control]") ?? [],
    );
    const currentIndex = controls.indexOf(event.currentTarget);

    if (currentIndex === -1 || controls.length === 0) {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? controls.length - 1
          : event.key === "ArrowDown" || event.key === "ArrowRight"
            ? (currentIndex + 1) % controls.length
            : (currentIndex - 1 + controls.length) % controls.length;

    controls[nextIndex]?.focus();
  }

  return (
    <nav
      aria-label={label}
      className="clv-stepper"
      data-ellipsis={ellipsis || undefined}
      data-orientation={orientation}
      data-size={size}
      data-variant={variant}
    >
      <ol className="clv-stepper__list">
        {steps.map((step) => {
          const hasProgress = step.status === "current" && normalizedProgress !== undefined;
          const progressValue = hasProgress ? (normalizedProgress ?? 0) : 0;
          const indicator = hasProgress ? (
            <StepProgressIndicator
              label={`Progresso da etapa atual: ${progressValue}%`}
              size={size}
              value={progressValue}
            >
              {step.number}
            </StepProgressIndicator>
          ) : (
            <span aria-hidden="true" className="clv-stepper__indicator">
              <span className="clv-stepper__indicator-value">{step.number}</span>
            </span>
          );
          const stepContent = (
            <span className="clv-stepper__content">
              <span className="clv-stepper__label">{step.label}</span>
              {step.description ? (
                <span className="clv-stepper__description">{step.description}</span>
              ) : null}
              <span className={`clv-stepper__status${showStatus ? "" : " clv-sr-only"}`}>
                {statusLabel[step.status]}
                {hasProgress ? `, ${progressValue}% concluído` : null}
              </span>
            </span>
          );
          const isInteractive = onStepChange !== undefined && step.status !== "blocked";

          return (
            <li
              aria-current={step.status === "current" ? "step" : undefined}
              className="clv-stepper__item"
              data-progress={hasProgress || undefined}
              data-status={step.status}
              key={step.id}
            >
              {isInteractive ? (
                <button
                  className="clv-stepper__control"
                  data-stepper-control
                  onClick={() => onStepChange(step)}
                  onKeyDown={moveFocus}
                  title={step.tooltipLabel}
                  type="button"
                >
                  {indicator}
                  {stepContent}
                </button>
              ) : step.tooltipLabel ? (
                <Tooltip content={step.label} triggerLabel={step.tooltipLabel}>
                  {indicator}
                </Tooltip>
              ) : (
                indicator
              )}
              {isInteractive ? null : stepContent}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
