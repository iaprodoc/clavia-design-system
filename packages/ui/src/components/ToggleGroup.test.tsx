import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

describe("ToggleGroup", () => {
  it("alterna múltiplas ações e expõe cada estado por aria-pressed", () => {
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        aria-label="Canais habilitados"
        defaultValue={["email"]}
        onValueChange={onValueChange}
        type="multiple"
      >
        <ToggleGroupItem value="email">E-mail</ToggleGroupItem>
        <ToggleGroupItem value="whatsapp">WhatsApp</ToggleGroupItem>
      </ToggleGroup>,
    );

    const email = screen.getByRole("button", { name: "E-mail" });
    const whatsapp = screen.getByRole("button", { name: "WhatsApp" });

    expect(screen.getByRole("group", { name: "Canais habilitados" })).toBeVisible();
    expect(email).toHaveAttribute("aria-pressed", "true");
    expect(whatsapp).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(whatsapp);
    expect(whatsapp).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "whatsapp"]);
  });

  it("suporta seleção única, desabilitação e botão nativo", () => {
    render(
      <ToggleGroup aria-label="Modo de visualização" disabled type="single" value="lista">
        <ToggleGroupItem value="lista">Lista</ToggleGroupItem>
        <ToggleGroupItem value="grade">Grade</ToggleGroupItem>
      </ToggleGroup>,
    );

    const list = screen.getByRole("button", { name: "Lista" });
    const grid = screen.getByRole("button", { name: "Grade" });
    expect(list).toBeDisabled();
    expect(grid).toBeDisabled();
    expect(list).toHaveAttribute("aria-pressed", "true");
    expect(list).toHaveAttribute("type", "button");
  });
});
