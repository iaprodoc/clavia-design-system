"use client";

import { CheckIcon, ChevronDownIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";
import {
  ComboBox as AriaComboBox,
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
} from "react-aria-components";

export interface ComboboxOption {
  description?: string;
  disabled?: boolean;
  label: string;
  value: string;
}

export interface ComboboxProps {
  autoComplete?: string;
  className?: string;
  defaultInputValue?: string;
  defaultOpen?: boolean;
  defaultValue?: string | null;
  description?: ReactNode;
  disabled?: boolean;
  emptyMessage?: string;
  error?: string;
  fullWidth?: boolean;
  id?: string;
  inputValue?: string;
  isOpen?: boolean;
  label: ReactNode;
  name?: string;
  onInputValueChange?: (value: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  onValueChange?: (value: string | null) => void;
  options: readonly ComboboxOption[];
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

export function Combobox({
  autoComplete,
  className,
  defaultInputValue,
  defaultOpen,
  defaultValue,
  description,
  disabled = false,
  emptyMessage = "Nenhuma opção encontrada.",
  error,
  fullWidth = true,
  id,
  inputValue,
  isOpen,
  label,
  name,
  onInputValueChange,
  onOpenChange,
  onValueChange,
  options,
  placeholder = "Busque ou selecione uma opção",
  required = false,
  value,
}: ComboboxProps) {
  const classes = ["clv-combobox", className].filter(Boolean).join(" ");

  return (
    <AriaComboBox
      allowsEmptyCollection
      className={classes}
      formValue="key"
      isDisabled={disabled}
      isInvalid={Boolean(error)}
      isRequired={required}
      onSelectionChange={(nextValue) => {
        onValueChange?.(nextValue === null ? null : String(nextValue));
      }}
      {...(fullWidth ? {} : { style: { width: "fit-content" } })}
      {...(typeof defaultOpen === "boolean" ? { defaultOpen } : {})}
      {...(defaultValue !== undefined ? { defaultSelectedKey: defaultValue } : {})}
      {...(defaultInputValue !== undefined ? { defaultInputValue } : {})}
      {...(id ? { id } : {})}
      {...(inputValue !== undefined ? { inputValue } : {})}
      {...(typeof isOpen === "boolean" ? { isOpen } : {})}
      {...(name ? { name } : {})}
      {...(onInputValueChange ? { onInputChange: onInputValueChange } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
      {...(value !== undefined ? { selectedKey: value } : {})}
    >
      <Label className="clv-combobox__label">{label}</Label>
      <div className="clv-combobox__input-group">
        <Input
          aria-invalid={error ? true : undefined}
          autoComplete={autoComplete}
          className="clv-combobox__input"
          placeholder={placeholder}
        />
        <Button aria-label="Mostrar opções" className="clv-combobox__trigger">
          <ChevronDownIcon data-icon="chevron-down" />
        </Button>
      </div>
      <Popover className="clv-combobox__popover" offset={8} placement="bottom start">
        <ListBox
          className="clv-combobox__listbox"
          renderEmptyState={() => (
            <div className="clv-combobox__empty" role="status">
              {emptyMessage}
            </div>
          )}
        >
          {options.map((option) => (
            <ListBoxItem
              className="clv-combobox__option"
              id={option.value}
              key={option.value}
              textValue={option.label}
              {...(option.disabled ? { isDisabled: true } : {})}
            >
              {({ isSelected }) => (
                <>
                  <span className="clv-combobox__option-content">
                    <span className="clv-combobox__option-label">{option.label}</span>
                    {option.description ? (
                      <span className="clv-combobox__option-description">{option.description}</span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="clv-combobox__option-indicator"
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
        <Text className="clv-combobox__description" slot="description">
          {description}
        </Text>
      ) : null}
      {error ? <FieldError className="clv-combobox__error">{error}</FieldError> : null}
    </AriaComboBox>
  );
}
