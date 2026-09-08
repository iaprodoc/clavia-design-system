import {
  type ButtonHTMLAttributes,
  createContext,
  type FieldsetHTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from "react";

import { type ToggleSize, type ToggleVariant, toggleClassName } from "./Toggle";

export type ToggleGroupType = "multiple" | "single";
export type ToggleGroupValue = string | readonly string[];

export interface ToggleGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "defaultValue"> {
  children: ReactNode;
  defaultValue?: ToggleGroupValue;
  disabled?: boolean;
  onValueChange?: (value: ToggleGroupValue) => void;
  orientation?: "horizontal" | "vertical";
  size?: ToggleSize;
  type: ToggleGroupType;
  value?: ToggleGroupValue;
  variant?: ToggleVariant;
}

export interface ToggleGroupItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed" | "value"> {
  children?: ReactNode;
  size?: ToggleSize;
  value: string;
  variant?: ToggleVariant;
}

interface ToggleGroupContextValue {
  disabled: boolean;
  isPressed: (value: string) => boolean;
  onItemClick: (value: string) => void;
  size: ToggleSize;
  variant: ToggleVariant;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function normalizeValue(value: ToggleGroupValue | undefined, type: ToggleGroupType) {
  if (type === "multiple") {
    return Array.isArray(value) ? [...value] : [];
  }

  return typeof value === "string" && value ? [value] : [];
}

export function ToggleGroup({
  children,
  className,
  defaultValue,
  disabled = false,
  onValueChange,
  orientation = "horizontal",
  size = "md",
  type,
  value,
  variant = "default",
  ...props
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState(() => normalizeValue(defaultValue, type));
  const isControlled = value !== undefined;
  const selectedValues = normalizeValue(isControlled ? value : internalValue, type);
  const classes = ["clv-toggle-group", className].filter(Boolean).join(" ");

  function onItemClick(itemValue: string) {
    const nextValues =
      type === "multiple"
        ? selectedValues.includes(itemValue)
          ? selectedValues.filter((selectedValue) => selectedValue !== itemValue)
          : [...selectedValues, itemValue]
        : selectedValues.includes(itemValue)
          ? []
          : [itemValue];
    const nextValue = type === "multiple" ? nextValues : (nextValues[0] ?? "");

    if (!isControlled) {
      setInternalValue(nextValues);
    }

    onValueChange?.(nextValue);
  }

  return (
    <fieldset
      {...props}
      className={classes}
      data-disabled={disabled || undefined}
      data-orientation={orientation}
    >
      <legend className="clv-sr-only">
        {typeof props["aria-label"] === "string" ? props["aria-label"] : "Ações agrupadas"}
      </legend>
      <ToggleGroupContext.Provider
        value={{
          disabled,
          isPressed: (itemValue) => selectedValues.includes(itemValue),
          onItemClick,
          size,
          variant,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </fieldset>
  );
}

export function ToggleGroupItem({
  children,
  className,
  disabled = false,
  onClick,
  size,
  value,
  variant,
  ...props
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error("ToggleGroupItem deve ser usado dentro de ToggleGroup.");
  }

  const pressed = context.isPressed(value);

  return (
    <button
      {...props}
      aria-pressed={pressed}
      className={toggleClassName({
        className,
        size: size ?? context.size,
        variant: variant ?? context.variant,
      })}
      data-state={pressed ? "on" : "off"}
      disabled={disabled || context.disabled}
      onClick={(event) => {
        context.onItemClick(value);
        onClick?.(event);
      }}
      type="button"
    >
      {children}
    </button>
  );
}
