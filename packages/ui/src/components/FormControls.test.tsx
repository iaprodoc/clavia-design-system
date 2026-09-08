import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";
import { Field } from "./Field";
import { NativeSelect } from "./NativeSelect";
import { RadioGroup } from "./RadioGroup";
import { Switch } from "./Switch";
import { Textarea } from "./Textarea";

describe("controles de formulário", () => {
  it("associa textarea e select aos metadados do Field", () => {
    render(
      <>
        <Field
          error="Explique como a clínica atende fora do horário."
          id="orientacao"
          label="Orientação"
        >
          <Textarea />
        </Field>
        <Field
          help="Escolha a opção mais próxima."
          id="tipo-atendimento"
          label="Tipo de atendimento"
        >
          <NativeSelect defaultValue="">
            <option disabled value="">
              Selecione
            </option>
            <option value="particular">Particular</option>
          </NativeSelect>
        </Field>
      </>,
    );

    expect(screen.getByLabelText("Orientação")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Tipo de atendimento")).toHaveAttribute(
      "aria-describedby",
      "tipo-atendimento-help",
    );
  });

  it("anuncia a descrição de uma confirmação sem depender da cor", () => {
    render(
      <Checkbox
        defaultChecked
        description="Você poderá alterar esta escolha antes da ativação."
        label="Confirmo que os dados estão corretos"
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Confirmo que os dados estão corretos" });
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAccessibleDescription(
      "Você poderá alterar esta escolha antes da ativação.",
    );
  });

  it("suporta tamanho e estado indeterminado sem perder a semântica nativa", () => {
    const { rerender } = render(
      <Checkbox indeterminate label="Selecionar todos os dados obrigatórios" size="md" />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Selecionar todos os dados obrigatórios",
    });

    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    expect(checkbox).toHaveAttribute("data-indeterminate", "true");
    expect(checkbox).not.toBeChecked();
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
    expect(checkbox.closest(".clv-checkbox")).toHaveClass("clv-checkbox--md");

    rerender(
      <Checkbox
        defaultChecked
        disabled
        key="disabled"
        label="Selecionar todos os dados obrigatórios"
      />,
    );

    const disabledCheckbox = screen.getByRole("checkbox", {
      name: "Selecionar todos os dados obrigatórios",
    });
    expect(disabledCheckbox).toBeChecked();
    expect(disabledCheckbox).toBeDisabled();
    expect((disabledCheckbox as HTMLInputElement).indeterminate).toBe(false);
  });

  it("associa erro ao checkbox independente", () => {
    render(
      <Checkbox error="Aceite os termos para continuar." label="Aceito os termos de atendimento" />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Aceito os termos de atendimento" });
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAccessibleDescription("Aceite os termos para continuar.");
    expect(screen.getByRole("alert")).toHaveTextContent("Aceite os termos para continuar.");
  });

  it("mantém o switch como controle nativo e acionável", () => {
    render(
      <Switch
        description="A clínica recebe uma confirmação após cada solicitação."
        label="Enviar confirmação por WhatsApp"
      />,
    );

    const control = screen.getByRole("switch", { name: "Enviar confirmação por WhatsApp" });
    fireEvent.click(control);

    expect(control).toBeChecked();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAccessibleDescription(
      "A clínica recebe uma confirmação após cada solicitação.",
    );
  });

  it("expõe tamanho e erro no switch sem depender apenas da cor", () => {
    render(
      <Switch error="Ative a confirmação para continuar." label="Enviar confirmação" size="lg" />,
    );

    const control = screen.getByRole("switch", { name: "Enviar confirmação" });
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAccessibleDescription("Ative a confirmação para continuar.");
    expect(control.closest(".clv-switch")).toHaveClass("clv-switch--size-lg");
  });

  it("expõe contexto, obrigatoriedade e erro no grupo de opções", () => {
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        description="Escolha a regra usada pela clínica."
        error="Escolha uma forma de confirmação."
        label="Como confirmar o agendamento?"
        name="confirmacao"
        onValueChange={onValueChange}
        options={[
          { label: "Mensagem automática", value: "mensagem" },
          { label: "Ligação da equipe", value: "ligacao" },
        ]}
        required
      />,
    );

    const group = screen.getByRole("group", { name: /Como confirmar o agendamento/ });
    const option = screen.getByRole("radio", { name: "Ligação da equipe" });
    fireEvent.click(option);

    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(option).toHaveAccessibleDescription(
      "Escolha a regra usada pela clínica. Escolha uma forma de confirmação.",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Escolha uma forma de confirmação.");
    expect(onValueChange).toHaveBeenCalledWith("ligacao");
  });
});
