import { CheckIcon } from "@clavia-ds/icons";
import { type ChangeEvent, type ReactNode, useId } from "react";

export interface OptionCardOption {
  description?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  label: ReactNode;
  value: string;
}

export type OptionCardsValue = string | string[];
export type OptionCardsVariant = "default" | "compact";

export interface OptionCardsProps {
  className?: string;
  columns?: 1 | 2 | 3;
  defaultValue?: OptionCardsValue;
  description?: ReactNode;
  disabled?: boolean;
  error?: string;
  label: ReactNode;
  multiple?: boolean;
  name: string;
  onValueChange?: (value: OptionCardsValue) => void;
  options: readonly OptionCardOption[];
  required?: boolean;
  variant?: OptionCardsVariant;
  value?: OptionCardsValue;
}

/**
 * Escolha uma ou mais alternativas curtas quando o texto complementar ajuda a comparar opções.
 * Para listas longas ou quando a economia de espaço for mais importante, use Select.
 */
export function OptionCards({
  className,
  columns = 2,
  defaultValue,
  description,
  disabled = false,
  error,
  label,
  multiple = false,
  name,
  onValueChange,
  options,
  required = false,
  variant = "default",
  value,
}: OptionCardsProps) {
  const generatedId = useId();
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const isControlled = value !== undefined;
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const defaultValues = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
      ? [defaultValue]
      : [];
  const classes = ["clv-option-cards", className].filter(Boolean).join(" ");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    if (!multiple) {
      onValueChange?.(nextValue);
      return;
    }

    const values = selectedValues.includes(nextValue)
      ? selectedValues.filter((item) => item !== nextValue)
      : [...selectedValues, nextValue];
    onValueChange?.(values);
  }

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
      className={classes}
      data-columns={columns}
      data-variant={variant}
    >
      <legend className="clv-option-cards__legend">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {required ? <span className="clv-sr-only"> (obrigatório)</span> : null}
      </legend>
      {description ? (
        <p className="clv-option-cards__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      <div className="clv-option-cards__options">
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          const selected = selectedValues.includes(option.value);

          return (
            <label
              className="clv-option-card"
              data-selected={selected || undefined}
              htmlFor={optionId}
              key={option.value}
            >
              <input
                aria-describedby={describedBy}
                className="clv-option-card__control"
                disabled={disabled || option.disabled}
                id={optionId}
                name={name}
                onChange={handleChange}
                required={required}
                type={multiple ? "checkbox" : "radio"}
                value={option.value}
                {...(isControlled
                  ? { checked: selected }
                  : { defaultChecked: defaultValues.includes(option.value) })}
              />
              {option.icon ? (
                <span aria-hidden="true" className="clv-option-card__icon">
                  {option.icon}
                </span>
              ) : null}
              <span className="clv-option-card__header">
                <span className="clv-option-card__label">{option.label}</span>
                <span aria-hidden="true" className="clv-option-card__check">
                  <CheckIcon />
                </span>
              </span>
              {option.description ? (
                <span className="clv-option-card__description">{option.description}</span>
              ) : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="clv-option-cards__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
