"use client";

import { type ChangeEvent, forwardRef, type TextareaHTMLAttributes, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Shows the current character count when `maxLength` is set. */
  showCharacterCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    "aria-invalid": ariaInvalid,
    className,
    defaultValue,
    disabled,
    id,
    maxLength,
    onChange,
    showCharacterCount = true,
    value,
    ...props
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(() => String(defaultValue ?? ""));
  const currentValue = value === undefined ? uncontrolledValue : String(value);
  const hasCharacterCount = showCharacterCount && typeof maxLength === "number";
  const isInvalid = ariaInvalid === true || ariaInvalid === "true";
  const rootClasses = ["clv-textarea-root", hasCharacterCount && "clv-textarea-root--with-counter"]
    .filter(Boolean)
    .join(" ");
  const controlClasses = ["clv-textarea", className].filter(Boolean).join(" ");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  };

  return (
    <div
      className={rootClasses}
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      <textarea
        aria-invalid={ariaInvalid}
        className={controlClasses}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        onChange={handleChange}
        ref={ref}
        value={value}
        {...props}
      />
      {hasCharacterCount ? (
        <output
          aria-label={`${currentValue.length} de ${maxLength} caracteres usados`}
          className="clv-textarea__counter"
          htmlFor={id}
        >
          <span aria-hidden="true">
            {currentValue.length}/{maxLength}
          </span>
        </output>
      ) : null}
    </div>
  );
});
