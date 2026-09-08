import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  const classes = ["clv-input", className].filter(Boolean).join(" ");

  return <input className={classes} ref={ref} {...props} />;
});
