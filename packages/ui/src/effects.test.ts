import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
}

describe("adoção da Effects Foundation", () => {
  it("usa aliases de componente nos pilotos aprovados", () => {
    expect(rule(".clv-button--glass")).toContain(
      "backdrop-filter: blur(var(--clv-button-glass-backdrop-blur))",
    );
    expect(rule(".clv-button--gradient")).toContain(
      "box-shadow: var(--clv-button-gradient-shadow)",
    );
    expect(css).toContain(
      "box-shadow: var(--clv-brand-panel-highlight), var(--clv-brand-panel-glow)",
    );
    expect(rule(".clv-sticky-action-bar__inner")).toContain("var(--clv-sticky-action-bar-shadow)");
  });

  it("mantém o acabamento físico do vidro local ao Button", () => {
    expect(css).toContain("--clv-button-glass-angle");
    expect(css).toContain("var(--clv-button-glass-edge)");
    expect(css).toContain("var(--clv-button-glass-edge-bright)");
    expect(rule(".clv-button--glass")).toContain("text-shadow var(--clv-motion-state-duration)");
    expect(rule(".clv-button--glass:not(:disabled):hover")).toContain(
      "text-shadow: 0 0.02em 0.025em var(--clv-button-glass-depth)",
    );
    expect(css).not.toMatch(
      /--clv-effect-glass-(depth|dispersion|refraction|light-angle|light-intensity)/,
    );
  });

  it("mantém foco, motion e elevation independentes", () => {
    expect(css).toContain("outline: var(--clv-focus-width) var(--clv-focus-style)");
    expect(css).toContain("var(--clv-motion-state-duration)");
    expect(rule(".clv-sticky-action-bar__inner")).toContain("var(--clv-sticky-action-bar-shadow)");
  });

  it("oferece fallback sem backdrop-filter e em forced colors", () => {
    const unsupported = css.slice(css.indexOf("@supports not ((backdrop-filter"));
    expect(unsupported).toContain(".clv-button--glass");
    expect(unsupported).toContain(".clv-brand-panel");
    expect(unsupported).toContain(".clv-sticky-action-bar__inner");

    const forcedColors = css.slice(css.lastIndexOf("@media (forced-colors: active)"));
    expect(forcedColors).toContain(".clv-brand-panel");
    expect(forcedColors).toContain("backdrop-filter: none");
    expect(forcedColors).toContain("box-shadow: none");
  });
});
