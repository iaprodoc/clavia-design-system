import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StepProgressIndicator } from "./StepProgressIndicator";

describe("StepProgressIndicator", () => {
  it("expõe o valor e mantém o contorno fechado", () => {
    const { container } = render(
      <StepProgressIndicator label="Progresso da fase Formulários" value={40}>
        F
      </StepProgressIndicator>,
    );

    const progress = screen.getByRole("progressbar", { name: "Progresso da fase Formulários" });
    const outline = container.querySelector(".clv-step-progress-indicator__outline");

    expect(progress).toHaveAttribute("aria-valuenow", "40");
    expect(progress).toHaveAttribute("aria-valuetext", "40% concluído");
    expect(outline).toHaveAttribute("r", "22");
    expect(outline).not.toHaveAttribute("stroke-dasharray");
    expect(outline).not.toHaveAttribute("stroke-dashoffset");
  });

  it("normaliza valores e preserva o tamanho compacto", () => {
    const { container } = render(
      <StepProgressIndicator label="Progresso da etapa" size="compact" value={140}>
        3
      </StepProgressIndicator>,
    );

    expect(screen.getByRole("progressbar", { name: "Progresso da etapa" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(container.querySelector(".clv-step-progress-indicator")).toHaveAttribute(
      "data-size",
      "compact",
    );
  });

  it.each([0, 40, 100])("preserva o mesmo contorno fechado em %i%%", (value) => {
    const { container } = render(
      <StepProgressIndicator label={`Progresso em ${value}%`} value={value}>
        F
      </StepProgressIndicator>,
    );
    const outline = container.querySelector(".clv-step-progress-indicator__outline");

    expect(outline).toHaveAttribute("r", "22");
    expect(outline).not.toHaveAttribute("stroke-dasharray");
    expect(outline).not.toHaveAttribute("stroke-dashoffset");
  });
});
