import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "./Field";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("conta os caracteres de um valor não controlado e preserva onChange", () => {
    const onChange = vi.fn();

    render(<Textarea aria-label="Orientação" maxLength={120} onChange={onChange} />);

    const textarea = screen.getByRole("textbox", { name: "Orientação" });
    fireEvent.change(textarea, { target: { value: "Retornar em um dia útil." } });

    expect(textarea).toHaveValue("Retornar em um dia útil.");
    expect(screen.getByText("24/120")).toBeInTheDocument();
    expect(screen.getByLabelText("24 de 120 caracteres usados")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("reflete a contagem de um valor controlado", () => {
    const { rerender } = render(
      <Textarea aria-label="Resumo" maxLength={20} onChange={() => undefined} value="Clavia" />,
    );

    expect(screen.getByText("6/20")).toBeInTheDocument();

    rerender(
      <Textarea aria-label="Resumo" maxLength={20} onChange={() => undefined} value="Clavia DS" />,
    );

    expect(screen.getByText("9/20")).toBeInTheDocument();
  });

  it("mantém erro, descrição e obrigatoriedade sob responsabilidade do Field", () => {
    render(
      <Field
        error="Descreva como a clínica deve orientar o paciente."
        help="Evite informações sensíveis."
        id="orientacao"
        label="Orientação"
        required
      >
        <Textarea maxLength={120} />
      </Field>,
    );

    const textarea = screen.getByRole("textbox", { name: /Orientação/ });

    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription(
      "Evite informações sensíveis. Descreva como a clínica deve orientar o paciente.",
    );
    expect(textarea.closest(".clv-textarea-root")).toHaveAttribute("data-invalid", "true");
  });

  it("permite ocultar o contador sem remover o limite nativo", () => {
    render(<Textarea aria-label="Nota interna" maxLength={10} showCharacterCount={false} />);

    expect(screen.getByRole("textbox", { name: "Nota interna" })).toHaveAttribute(
      "maxlength",
      "10",
    );
    expect(screen.queryByText("0/10")).not.toBeInTheDocument();
  });
});
