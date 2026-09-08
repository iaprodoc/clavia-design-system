import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Combobox } from "./Combobox";

const options = [
  { description: "Atendimento do coração e da circulação.", label: "Cardiologia", value: "cardio" },
  {
    description: "Atendimento de crianças e adolescentes.",
    label: "Pediatria",
    value: "pediatria",
  },
  { disabled: true, label: "Neurologia", value: "neuro" },
] as const;

describe("Combobox", () => {
  it("filtra e seleciona uma opção pela API da Clavia", async () => {
    const onValueChange = vi.fn();

    render(
      <Combobox
        description="Digite para reduzir a lista de opções."
        label="Especialidade"
        onValueChange={onValueChange}
        options={options}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Especialidade" });
    const trigger = screen.getByRole("button", { name: /Mostrar opções/ });
    expect(trigger.querySelector('[data-icon="chevron-down"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    fireEvent.click(trigger);
    fireEvent.change(input, { target: { value: "card" } });
    const cardiologyOption = await screen.findByRole("option", { name: /Cardiologia/ });
    expect(cardiologyOption.querySelector('[data-icon="check"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    fireEvent.click(cardiologyOption);

    expect(onValueChange).toHaveBeenCalledWith("cardio");
    expect(input).toHaveValue("Cardiologia");
    expect(input).toHaveAccessibleDescription("Digite para reduzir a lista de opções.");
  });

  it("comunica erro e estado desabilitado sem depender apenas da cor", () => {
    const { rerender } = render(
      <Combobox
        error="Escolha uma especialidade para continuar."
        label="Especialidade"
        options={options}
      />,
    );

    const invalidInput = screen.getByRole("combobox", { name: "Especialidade" });
    expect(invalidInput).toHaveAttribute("aria-invalid", "true");
    expect(invalidInput).toHaveAccessibleDescription("Escolha uma especialidade para continuar.");

    rerender(<Combobox disabled label="Especialidade" options={options} />);

    expect(screen.getByRole("combobox", { name: "Especialidade" })).toBeDisabled();
  });

  it("mostra uma mensagem útil quando a busca não encontra opções", async () => {
    render(<Combobox label="Especialidade" options={options} />);

    const input = screen.getByRole("combobox", { name: "Especialidade" });
    fireEvent.click(screen.getByRole("button", { name: /Mostrar opções/ }));
    fireEvent.change(input, {
      target: { value: "odontologia" },
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Nenhuma opção encontrada.");
  });
});
