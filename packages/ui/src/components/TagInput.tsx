import { PencilIcon, XIcon } from "@clavia-ds/icons";
import { type ChangeEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export interface TagInputProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  inputType?: "tel" | "text";
  label: string;
  maxLength?: number;
  maxTags?: number;
  name?: string;
  onChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  validateTag?: (value: string) => string | undefined;
  values: readonly string[];
}

/**
 * Cria e edita uma lista curta de valores livres sem assumir regras de domínio.
 */
export function TagInput({
  className,
  description,
  disabled = false,
  error,
  id: providedId,
  inputType = "text",
  label,
  maxLength = 80,
  maxTags,
  name,
  onChange,
  placeholder = "Adicionar item",
  required = false,
  validateTag,
  values,
}: TagInputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = `${id}-error`;
  const countId = `${id}-count`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string>();
  const visibleError = error ?? validationError;
  const limitReached = maxTags !== undefined && values.length >= maxTags;
  const classes = ["clv-tag-input", className].filter(Boolean).join(" ");

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  function cancelEditing() {
    setEditingIndex(null);
    setInputValue("");
    setValidationError(undefined);
  }

  function commitValue() {
    const value = inputValue.trim();

    if (!value) {
      return;
    }

    const duplicate = values.some(
      (item, index) =>
        index !== editingIndex &&
        item.localeCompare(value, undefined, { sensitivity: "accent" }) === 0,
    );

    if (duplicate) {
      setValidationError("Este item já foi adicionado.");
      return;
    }

    if (editingIndex === null && limitReached) {
      setValidationError(`Você pode adicionar no máximo ${maxTags} itens.`);
      return;
    }

    const customError = validateTag?.(value);
    if (customError) {
      setValidationError(customError);
      return;
    }

    const nextValues = [...values];
    if (editingIndex === null) {
      nextValues.push(value);
    } else {
      nextValues[editingIndex] = value;
    }

    onChange(nextValues);
    cancelEditing();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    setValidationError(undefined);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || (event.key === "," && inputType === "text")) {
      event.preventDefault();
      commitValue();
      return;
    }

    if (event.key === "Escape" && editingIndex !== null) {
      event.preventDefault();
      cancelEditing();
      return;
    }

    if (event.key === "Backspace" && inputValue === "" && editingIndex === null && values.length) {
      onChange(values.slice(0, -1));
    }
  }

  function editTag(index: number) {
    setEditingIndex(index);
    setInputValue(values[index] ?? "");
    setValidationError(undefined);
  }

  function removeTag(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
    if (editingIndex === index) {
      cancelEditing();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  }

  return (
    <div className={classes}>
      <label className="clv-tag-input__label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {required ? <span className="clv-sr-only"> (obrigatório)</span> : null}
      </label>
      {values.length ? (
        <ul aria-label={`${label}: itens adicionados`} className="clv-tag-input__list">
          {values.map((tag, index) => (
            <li className="clv-tag-input__tag" key={tag}>
              <span>{tag}</span>
              <button
                aria-label={`Editar ${tag}`}
                className="clv-tag-input__tag-action"
                disabled={disabled}
                onClick={() => editTag(index)}
                type="button"
              >
                <PencilIcon aria-hidden="true" />
              </button>
              <button
                aria-label={`Remover ${tag}`}
                className="clv-tag-input__tag-action"
                disabled={disabled}
                onClick={() => removeTag(index)}
                type="button"
              >
                <XIcon aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="clv-tag-input__control">
        <input
          aria-describedby={[descriptionId, visibleError ? errorId : undefined, countId]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={visibleError ? true : undefined}
          className="clv-input clv-tag-input__input"
          disabled={disabled || (limitReached && editingIndex === null)}
          id={id}
          maxLength={maxLength}
          name={name}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={editingIndex === null ? placeholder : "Edite o item"}
          ref={inputRef}
          required={required && values.length === 0}
          type={inputType}
          value={inputValue}
        />
        <button
          className="clv-tag-input__add"
          disabled={disabled || (!inputValue.trim() && editingIndex === null)}
          onClick={commitValue}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          {editingIndex === null ? "Adicionar" : "Salvar edição"}
        </button>
        {editingIndex !== null ? (
          <button className="clv-tag-input__cancel" onClick={cancelEditing} type="button">
            Cancelar
          </button>
        ) : null}
      </div>
      {description && !visibleError ? (
        <p className="clv-tag-input__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {visibleError ? (
        <p className="clv-tag-input__error" id={errorId} role="alert">
          {visibleError}
        </p>
      ) : null}
      <p className="clv-tag-input__count" id={countId}>
        {maxTags === undefined ? `${values.length} itens` : `${values.length} de ${maxTags} itens`}
      </p>
    </div>
  );
}
