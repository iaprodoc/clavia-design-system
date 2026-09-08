import { QuestionIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";

import { Tooltip } from "./Tooltip";

export type MetricCardTone = "neutral" | "success" | "warning" | "danger";
export type MetricCardValueFormat = "default" | "two-digit";

export interface MetricCardProps {
  className?: string;
  description?: string;
  label: string;
  tag?: ReactNode;
  trend?: ReactNode;
  tone?: MetricCardTone;
  value: ReactNode;
  valueFormat?: MetricCardValueFormat;
}

function formatValue(value: ReactNode, valueFormat: MetricCardValueFormat) {
  if (valueFormat !== "two-digit" || (typeof value !== "number" && typeof value !== "string")) {
    return value;
  }

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 0 || numericValue >= 10) {
    return value;
  }

  return String(numericValue).padStart(2, "0");
}

export function MetricCard({
  description,
  className,
  label,
  tag,
  tone = "neutral",
  trend,
  value,
  valueFormat = "default",
}: MetricCardProps) {
  return (
    <section
      aria-label={label}
      className={["clv-metric-card", `clv-metric-card--${tone}`, className]
        .filter(Boolean)
        .join(" ")}
      data-tone={tone}
    >
      <div className="clv-metric-card__heading">
        <p className="clv-metric-card__label">{label}</p>
        {tag || description ? (
          <div className="clv-metric-card__heading-actions">
            {tag ? <div className="clv-metric-card__tag">{tag}</div> : null}
            {description ? (
              <div className="clv-contextual-help clv-metric-card__help">
                <Tooltip content={description} triggerLabel={`Mais informações sobre ${label}`}>
                  <QuestionIcon aria-hidden="true" />
                </Tooltip>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="clv-metric-card__value" data-value-format={valueFormat}>
        {formatValue(value, valueFormat)}
      </p>
      {trend ? <p className="clv-metric-card__trend">{trend}</p> : null}
    </section>
  );
}
