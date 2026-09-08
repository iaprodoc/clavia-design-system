import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

export type CheckboxSize = "md" | "lg";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  description?: ReactNode;
  error?: ReactNode;
  indeterminate?: boolean;
  label: ReactNode;
  size?: CheckboxSize;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    className,
    description,
    id,
    indeterminate = false,
    label,
    error,
    size = "lg",
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const controlRef = useRef<HTMLInputElement>(null);
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid = Boolean(error) || ariaInvalid === true || ariaInvalid === "true";
  const classes = [
    "clv-checkbox",
    `clv-checkbox--${size}`,
    isInvalid && "clv-checkbox--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  useImperativeHandle(ref, () => controlRef.current as HTMLInputElement, []);

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={classes}>
      <input
        {...props}
        aria-checked={indeterminate ? "mixed" : undefined}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className="clv-checkbox__control"
        data-indeterminate={indeterminate || undefined}
        id={controlId}
        ref={controlRef}
        type="checkbox"
      />
      <span className="clv-checkbox__copy">
        <label className="clv-checkbox__label" htmlFor={controlId}>
          {label}
        </label>
        {description ? (
          <span className="clv-checkbox__description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </span>
      {error ? (
        <span aria-live="assertive" className="clv-checkbox__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
});
