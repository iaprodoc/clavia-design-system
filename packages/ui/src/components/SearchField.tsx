"use client";

import { SearchIcon, XIcon } from "@clavia-ds/icons";
import { forwardRef, type InputHTMLAttributes, useId } from "react";

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
  clearLabel?: string;
  label?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  value: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    clearLabel = "Limpar busca",
    className,
    label = "Buscar",
    onChange,
    onClear,
    placeholder = "Buscar",
    value,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const classes = ["clv-search-field", className].filter(Boolean).join(" ");
  const clear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className={classes} data-has-value={value ? "true" : "false"}>
      <label className="clv-sr-only" htmlFor={id}>
        {label}
      </label>
      <SearchIcon aria-hidden="true" className="clv-search-field__icon" />
      <input
        {...props}
        className="clv-search-field__input"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        ref={ref}
        type="search"
        value={value}
      />
      {value ? (
        <button
          aria-label={clearLabel}
          className="clv-search-field__clear"
          onClick={clear}
          disabled={props.disabled}
          type="button"
        >
          <XIcon aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
});
