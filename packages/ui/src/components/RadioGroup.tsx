"use client";

import { type ChangeEvent, type ReactNode, useId } from "react";

export interface RadioOption {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface RadioGroupProps {
  className?: string;
  defaultValue?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: string;
  label: ReactNode;
  name: string;
  onValueChange?: (value: string) => void;
  options: readonly RadioOption[];
  required?: boolean;
  value?: string;
}

export function RadioGroup({
  className,
  defaultValue,
  description,
  disabled = false,
  error,
  label,
  name,
  onValueChange,
  options,
  required = false,
  value,
}: RadioGroupProps) {
  const generatedId = useId();
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const classes = ["clv-radio-group", className].filter(Boolean).join(" ");
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onValueChange?.(event.target.value);
  }

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
      className={classes}
      data-disabled={disabled || undefined}
      data-invalid={error || undefined}
    >
      <legend className="clv-radio-group__legend">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {required ? <span className="clv-sr-only"> (obrigatório)</span> : null}
      </legend>
      {description ? (
        <p className="clv-radio-group__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      <div className="clv-radio-group__options">
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          const optionDescriptionId = option.description ? `${optionId}-description` : undefined;
          const optionDescribedBy =
            [describedBy, optionDescriptionId].filter(Boolean).join(" ") || undefined;

          return (
            <div className="clv-radio" key={option.value}>
              <input
                aria-describedby={optionDescribedBy}
                checked={isControlled ? value === option.value : undefined}
                className="clv-radio__control"
                defaultChecked={!isControlled && defaultValue === option.value}
                disabled={disabled || option.disabled}
                id={optionId}
                name={name}
                onChange={handleChange}
                required={required}
                type="radio"
                value={option.value}
              />
              <span className="clv-radio__copy">
                <label className="clv-radio__label" htmlFor={optionId}>
                  {option.label}
                </label>
                {option.description ? (
                  <span className="clv-radio__description" id={optionDescriptionId}>
                    {option.description}
                  </span>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
      {error ? (
        <p className="clv-radio-group__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
