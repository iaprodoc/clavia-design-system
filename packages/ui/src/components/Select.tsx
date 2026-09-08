"use client";

import { CheckIcon, ChevronDownIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";
import {
  Select as AriaSelect,
  Button,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SelectValue,
  Text,
} from "react-aria-components";

export interface SelectOption {
  description?: string;
  disabled?: boolean;
  label: string;
  value: string;
}

export interface SelectProps {
  autoComplete?: string;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string | null;
  description?: ReactNode;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  id?: string;
  isOpen?: boolean;
  label: ReactNode;
  name?: string;
  onOpenChange?: (isOpen: boolean) => void;
  onValueChange?: (value: string | null) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

export function Select({
  autoComplete,
  className,
  defaultOpen,
  defaultValue,
  description,
  disabled = false,
  error,
  fullWidth = true,
  id,
  isOpen,
  label,
  name,
  onOpenChange,
  onValueChange,
  options,
  placeholder = "Selecione uma opção",
  required = false,
  value,
}: SelectProps) {
  const classes = ["clv-select", className].filter(Boolean).join(" ");

  return (
    <AriaSelect
      className={classes}
      data-slot="select"
      isDisabled={disabled}
      isInvalid={Boolean(error)}
      isRequired={required}
      onSelectionChange={(nextValue) => {
        onValueChange?.(nextValue === null ? null : String(nextValue));
      }}
      placeholder={placeholder}
      {...(fullWidth ? {} : { style: { width: "fit-content" } })}
      {...(autoComplete ? { autoComplete } : {})}
      {...(typeof defaultOpen === "boolean" ? { defaultOpen } : {})}
      {...(defaultValue !== undefined ? { defaultSelectedKey: defaultValue } : {})}
      {...(id ? { id } : {})}
      {...(typeof isOpen === "boolean" ? { isOpen } : {})}
      {...(name ? { name } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
      {...(value !== undefined ? { selectedKey: value } : {})}
    >
      <Label className="clv-select__label" data-slot="select-label">
        {label}
      </Label>
      <Button
        aria-invalid={error ? true : undefined}
        className="clv-select__trigger"
        data-slot="select-trigger"
      >
        <SelectValue className="clv-select__value" data-slot="select-value" />
        <span aria-hidden="true" className="clv-select__indicator" data-slot="select-indicator">
          <ChevronDownIcon data-icon="chevron-down" />
        </span>
      </Button>
      <Popover className="clv-select__popover" data-slot="select-popover" placement="bottom start">
        <ListBox className="clv-select__listbox" data-slot="select-listbox">
          {options.map((option) => (
            <ListBoxItem
              className="clv-select__option"
              data-slot="select-option"
              id={option.value}
              key={option.value}
              textValue={option.label}
              {...(option.disabled ? { isDisabled: true } : {})}
            >
              {({ isSelected }) => (
                <>
                  <span className="clv-select__option-content">
                    <span className="clv-select__option-label">{option.label}</span>
                    {option.description ? (
                      <span className="clv-select__option-description">{option.description}</span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="clv-select__option-indicator"
                    data-visible={isSelected || undefined}
                  >
                    <CheckIcon data-icon="check" />
                  </span>
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
      {description && !error ? (
        <Text className="clv-select__description" data-slot="select-description" slot="description">
          {description}
        </Text>
      ) : null}
      {error ? (
        <FieldError className="clv-select__error" data-slot="select-error">
          {error}
        </FieldError>
      ) : null}
    </AriaSelect>
  );
}
