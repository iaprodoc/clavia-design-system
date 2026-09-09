"use client";

import {
  type ChangeEvent,
  type CSSProperties,
  forwardRef,
  type InputHTMLAttributes,
  useId,
  useState,
} from "react";

export interface InputOTPProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "defaultValue" | "maxLength" | "size" | "type" | "value"
  > {
  /** Número de posições exibidas. */
  length?: number;
  /** Notificação específica para o preenchimento completo do código. */
  onComplete?: (value: string) => void;
  /** Valor normalizado para o contrato de controles do Design System. */
  onValueChange?: (value: string) => void;
  /** Conteúdo opcional exibido em cada posição vazia. */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
}

function clampValue(value: string, length: number) {
  return value.slice(0, length);
}

export const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(function InputOTP(
  {
    "aria-label": ariaLabel,
    className,
    defaultValue = "",
    id,
    inputMode = "numeric",
    length = 6,
    onChange,
    onComplete,
    onValueChange,
    placeholder: placeholderCharacter,
    value,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(() => clampValue(defaultValue, length));
  const controlId = id ?? generatedId;
  const currentValue = clampValue(value ?? internalValue, length);
  const classes = ["clv-input-otp", className].filter(Boolean).join(" ");
  const style = { "--input-otp-length": length } as CSSProperties;
  const slotIds = Array.from({ length }, (_, position) => `${controlId}-slot-${position}`);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = clampValue(event.target.value, length);

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    if (event.target.value !== nextValue) {
      event.target.value = nextValue;
    }

    onChange?.(event);
    onValueChange?.(nextValue);

    if (nextValue.length === length && currentValue.length !== length) {
      onComplete?.(nextValue);
    }
  }

  return (
    <div
      className={classes}
      data-complete={currentValue.length === length || undefined}
      data-disabled={props.disabled || undefined}
      style={style}
    >
      {Array.from({ length }, (_, position) => {
        const character = currentValue[position] ?? "";
        const isActive = !props.disabled && position === Math.min(currentValue.length, length - 1);

        return (
          <span
            aria-hidden="true"
            className="clv-input-otp__slot"
            data-active={isActive || undefined}
            data-filled={Boolean(character) || undefined}
            key={slotIds[position]}
          >
            {character || placeholderCharacter || ""}
          </span>
        );
      })}
      <input
        {...props}
        aria-label={ariaLabel}
        className="clv-input-otp__input"
        defaultValue={value === undefined ? clampValue(defaultValue, length) : undefined}
        id={controlId}
        inputMode={inputMode}
        maxLength={length}
        onChange={handleChange}
        ref={ref}
        type="text"
        value={value === undefined ? undefined : currentValue}
      />
    </div>
  );
});
