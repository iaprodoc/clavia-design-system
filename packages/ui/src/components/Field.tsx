import { QuestionIcon } from "@clavia-ds/icons";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

import { Tooltip } from "./Tooltip";

type ControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "false" | "true";
  id?: string;
  required?: boolean;
};

export interface FieldProps {
  children: ReactElement<ControlProps>;
  error?: string;
  help?: ReactNode;
  /**
   * Orientação curta e opcional, como origem, responsabilidade, escopo ou configuração global,
   * exibida sob demanda ao lado do rótulo.
   * Use `help` quando a pessoa precisar ler a informação antes de preencher o campo.
   */
  helpTooltip?: ReactNode;
  id: string;
  label: ReactNode;
  motion?: "enter" | "none";
  required?: boolean;
}

export function Field({
  children,
  error,
  help,
  helpTooltip,
  id,
  label,
  motion = "enter",
  required = false,
}: FieldProps) {
  const isRequired = required || Boolean(children.props.required);
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const existingDescribedBy = children.props["aria-describedby"];
  const describedBy = [existingDescribedBy, helpId, errorId].filter(Boolean).join(" ") || undefined;
  const controlProps: ControlProps = { id };

  if (describedBy) {
    controlProps["aria-describedby"] = describedBy;
  }

  if (error) {
    controlProps["aria-invalid"] = true;
  }

  if (isRequired) {
    controlProps.required = true;
  }

  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children, controlProps)
    : children;
  const tooltipLabel =
    typeof label === "string"
      ? `Mais informações sobre ${label}`
      : "Mais informações sobre este campo";

  return (
    <div
      className="clv-field"
      data-invalid={error || undefined}
      data-motion={motion}
      data-required={isRequired || undefined}
    >
      <div className="clv-field__label-row">
        <label className="clv-field__label" htmlFor={id}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="clv-field__required-marker">
              {" *"}
            </span>
          ) : null}
          {isRequired ? <span className="clv-sr-only"> (obrigatório)</span> : null}
        </label>
        {helpTooltip ? (
          <span className="clv-contextual-help clv-field__help-tooltip">
            <Tooltip content={helpTooltip} triggerLabel={tooltipLabel}>
              <QuestionIcon aria-hidden="true" />
            </Tooltip>
          </span>
        ) : null}
      </div>
      {control}
      {help ? (
        <p className="clv-field__help" id={helpId}>
          {help}
        </p>
      ) : null}
      {error ? (
        <p aria-live="assertive" className="clv-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
