import { forwardRef, type InputHTMLAttributes, type ReactNode, useId, useState } from "react";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  description?: ReactNode;
  error?: ReactNode;
  label: ReactNode;
  size?: SwitchSize;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    className,
    defaultChecked = false,
    description,
    error,
    id,
    label,
    size = "md",
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    onChange,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid = Boolean(error) || ariaInvalid === true || ariaInvalid === "true";
  const classes = [
    "clv-switch",
    `clv-switch--size-${size}`,
    isInvalid && "clv-switch--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const isControlled = checked !== undefined;
  const switchChecked = isControlled ? checked : isChecked;

  return (
    <div
      className={classes}
      data-disabled={props.disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      <input
        {...props}
        aria-checked={switchChecked}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        checked={isControlled ? checked : undefined}
        className="clv-switch__input"
        defaultChecked={!isControlled ? defaultChecked : undefined}
        id={controlId}
        onChange={(event) => {
          if (!isControlled) {
            setIsChecked(event.target.checked);
          }

          onChange?.(event);
        }}
        ref={ref}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className="clv-switch__track">
        <span className="clv-switch__thumb" />
      </span>
      <span className="clv-switch__copy">
        <label className="clv-switch__label" htmlFor={controlId}>
          {label}
        </label>
        {description ? (
          <span className="clv-switch__description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </span>
      {error ? (
        <span aria-live="assertive" className="clv-switch__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
});
