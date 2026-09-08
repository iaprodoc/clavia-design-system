import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OptionCards } from "./OptionCards";

const options = [
  { description: "Atendimento no consultório", label: "Presencial", value: "presencial" },
  { label: "Online", value: "online" },
  { disabled: true, label: "Domiciliar", value: "domiciliar" },
] as const;

describe("OptionCards", () => {
  it("associa legenda, ajuda e obrigatoriedade ao grupo de escolha única", () => {
    render(
      <OptionCards
        description="Escolha a modalidade que a clínica oferece."
        label="Modalidade de atendimento"
        name="modalidade"
        options={options}
        required
      />,
    );

    const group = screen.getByRole("group", { name: /Modalidade de atendimento/ });

    expect(group).toHaveAccessibleDescription("Escolha a modalidade que a clínica oferece.");
    expect(screen.getByRole("radio", { name: /^Presencial/ })).toBeRequired();
    expect(screen.getByText("Atendimento no consultório")).toBeInTheDocument();
  });

  it("comunica a seleção única e respeita as opções desabilitadas", () => {
    const onValueChange = vi.fn();

    render(
      <OptionCards
        label="Modalidade de atendimento"
        name="modalidade"
        onValueChange={onValueChange}
        options={options}
        value="presencial"
      />,
    );

    const online = screen.getByRole("radio", { name: "Online" });

    expect(screen.getByRole("radio", { name: /^Presencial/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Domiciliar" })).toBeDisabled();
    fireEvent.click(online);
    expect(onValueChange).toHaveBeenCalledWith("online");
  });

  it("permite múltiplas escolhas e devolve os valores atualizados", () => {
    const onValueChange = vi.fn();

    render(
      <OptionCards
        label="Formas de pagamento"
        multiple
        name="pagamento"
        onValueChange={onValueChange}
        options={options}
        value={["presencial"]}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Online" }));

    expect(onValueChange).toHaveBeenCalledWith(["presencial", "online"]);
  });

  it("expõe erro e foco visível sem depender apenas da cor", () => {
    render(
      <OptionCards
        error="Escolha uma modalidade para continuar."
        label="Modalidade de atendimento"
        name="modalidade"
        options={options}
      />,
    );

    const group = screen.getByRole("group", { name: "Modalidade de atendimento" });
    const radio = screen.getByRole("radio", { name: /^Presencial/ });

    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAccessibleDescription("Escolha uma modalidade para continuar.");
    radio.focus();
    expect(radio).toHaveFocus();
  });

  it("expõe a variante compacta sem alterar a semântica das escolhas", () => {
    render(
      <OptionCards
        label="Formas de pagamento"
        multiple
        name="pagamento"
        options={options}
        variant="compact"
      />,
    );

    expect(screen.getByRole("group", { name: "Formas de pagamento" })).toHaveAttribute(
      "data-variant",
      "compact",
    );
  });
});
