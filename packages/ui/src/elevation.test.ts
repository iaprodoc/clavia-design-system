import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
}

describe("adoção da Elevation Foundation", () => {
  it("usa aliases de componente nos pilotos", () => {
    expect(rule(".clv-select__popover")).toContain("box-shadow: var(--clv-select-popover-shadow)");
    expect(rule(".clv-combobox__popover")).toContain(
      "box-shadow: var(--clv-select-popover-shadow)",
    );
    expect(rule(".clv-tooltip__content")).toContain("box-shadow: var(--clv-tooltip-shadow)");
    expect(rule(".clv-step-card--interactive:not(:disabled):hover")).toContain(
      "box-shadow: var(--clv-step-card-interactive-shadow)",
    );
  });

  it("não consome o alias global interactive em componentes", () => {
    expect(css).not.toContain("var(--clv-elevation-interactive)");
  });

  it("preserva foco e stacking como decisões independentes", () => {
    expect(css).toContain("outline: var(--clv-focus-width) var(--clv-focus-style)");
    expect(rule(".clv-step-card--interactive:not(:disabled):hover")).toContain("z-index: 1");
  });

  it("oferece limites visíveis quando forced colors remove sombras", () => {
    const forcedColors = css.slice(css.lastIndexOf("@media (forced-colors: active)"));
    expect(forcedColors).toContain(".clv-tooltip__content");
    expect(forcedColors).toContain(
      "border: var(--clv-border-width-thin) var(--clv-border-style-solid) CanvasText",
    );
    expect(forcedColors).toContain("box-shadow: none");
  });
});
