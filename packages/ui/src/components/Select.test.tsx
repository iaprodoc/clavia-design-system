import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

const options = [
  { label: "Presencial", value: "presencial" },
  { label: "Remoto", value: "remoto" },
  { disabled: true, label: "Híbrido", value: "hibrido" },
] as const;

describe("Select", () => {
  it("associa rótulo, ajuda e obrigatoriedade ao controle", () => {
    render(
      <Select
        description="Escolha a opção que melhor representa a rotina atual."
        label="Tipo de atendimento"
        name="tipo-atendimento"
        options={options}
        required
      />,
    );

    const trigger = screen.getByRole("button", { name: /Tipo de atendimento/ });

    expect(trigger.querySelector('[data-icon="chevron-down"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(trigger).toHaveAccessibleDescription(
      "Escolha a opção que melhor representa a rotina atual.",
    );
    expect(screen.getByText("Tipo de atendimento")).toBeInTheDocument();
  });

  it("abre a lista e comunica a opção selecionada", async () => {
    const onValueChange = vi.fn();

    render(<Select label="Tipo de atendimento" onValueChange={onValueChange} options={options} />);

    fireEvent.click(screen.getByRole("button", { name: /Tipo de atendimento/ }));
    const remoteOption = await screen.findByRole("option", { name: "Remoto" });
    expect(remoteOption.querySelector('[data-icon="check"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    fireEvent.click(remoteOption);

    expect(onValueChange).toHaveBeenCalledWith("remoto");
    expect(screen.getByRole("button", { name: /Tipo de atendimento/ })).toHaveTextContent("Remoto");
  });

  it("expõe erro e estado desabilitado sem depender apenas da cor", () => {
    const { rerender } = render(
      <Select
        error="Escolha um tipo de atendimento para continuar."
        label="Tipo de atendimento"
        options={options}
      />,
    );

    const invalidTrigger = screen.getByRole("button", { name: /Tipo de atendimento/ });

    expect(invalidTrigger.closest(".clv-select")).toHaveAttribute("data-invalid", "true");
    expect(invalidTrigger).toHaveAccessibleDescription(
      "Escolha um tipo de atendimento para continuar.",
    );
    expect(screen.getByText("Escolha um tipo de atendimento para continuar.")).toBeInTheDocument();

    rerender(<Select disabled label="Tipo de atendimento" options={options} />);

    expect(screen.getByRole("button", { name: /Tipo de atendimento/ })).toBeDisabled();
  });
});
