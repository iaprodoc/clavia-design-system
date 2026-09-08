import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("expõe um disparador nomeado e apresenta o conteúdo", () => {
    render(
      <Tooltip
        content="Sobre a Clínica"
        defaultOpen
        triggerLabel="Informações sobre Sobre a Clínica"
      >
        <span aria-hidden="true">?</span>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Informações sobre Sobre a Clínica" });

    expect(trigger).toHaveAttribute("tabindex", "0");
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveTextContent("Sobre a Clínica");
    expect(tooltip).toHaveAttribute("data-placement", "top");
    expect(document.querySelector(".clv-tooltip__arrow")).toHaveAttribute("data-placement", "top");
  });

  it("aceita toque no disparador e pode omitir a seta", () => {
    render(
      <Tooltip
        content="Briefing"
        defaultOpen
        showArrow={false}
        triggerLabel="Informações sobre Briefing"
      >
        <span aria-hidden="true">B</span>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Informações sobre Briefing" });

    fireEvent.click(trigger);

    expect(trigger).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(document.querySelector(".clv-tooltip__arrow")).not.toBeInTheDocument();
  });
});
