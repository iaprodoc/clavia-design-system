import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
}

describe("adoção da Motion Foundation", () => {
  it("trata Tooltip como entrada e saída sem animar sua elevação", () => {
    const tooltip = rule(".clv-tooltip__content");
    const exiting = rule('.clv-tooltip__content[data-exiting="true"]');

    expect(tooltip).toContain(
      "opacity var(--clv-motion-enter-duration) var(--clv-motion-enter-easing)",
    );
    expect(tooltip).toContain(
      "transform var(--clv-motion-enter-duration) var(--clv-motion-enter-easing)",
    );
    expect(tooltip).not.toContain("box-shadow var(");
    expect(exiting).toContain("transition-duration: var(--clv-motion-exit-duration)");
    expect(exiting).toContain("transition-timing-function: var(--clv-motion-exit-easing)");
  });

  it("mantém foco fora de animações de motion", () => {
    expect(rule('.clv-tooltip__trigger[data-focus-visible="true"]')).not.toContain("transition");
    expect(rule(".clv-step-card--interactive:focus-visible")).toContain("transition: none");
    expect(rule('.clv-slider__thumb[data-focus-visible="true"]')).toContain("transition: none");
  });

  it("usa ciclos próprios e remove loops não essenciais", () => {
    expect(rule(".clv-button__spinner")).toContain(
      "var(--clv-motion-cycle-loading) var(--clv-motion-easing-linear) infinite",
    );
    expect(css).toContain(
      ".clv-save-status--saving .clv-save-status__mark::before,\n.clv-save-status--saving .clv-save-status__mark::after",
    );
    expect(css).toContain("var(--clv-motion-easing-linear) infinite");
    expect(rule(".clv-save-status__mark::before,")).not.toContain("animation:");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.clv-save-status--saving \.clv-save-status__mark::before,[\s\S]*?animation:\s*none/,
    );
    expect(rule(".clv-skeleton--motion-pulse")).toContain("var(--clv-motion-cycle-ambient)");
    expect(rule(".clv-skeleton--motion-shimmer::after")).toContain(
      "var(--clv-motion-cycle-skeleton)",
    );
    expect(css).toMatch(
      /\.clv-skeleton\[data-paused="true"\][\s\S]*?animation-play-state:\s*paused/,
    );
  });

  it("move progresso determinado com duração curta e sem loop", () => {
    expect(rule(".clv-progress__indicator")).toContain(
      "width var(--clv-motion-progress-duration) var(--clv-motion-progress-easing)",
    );
    expect(css).toMatch(
      /\.clv-progress__circular-indicator\s*\{[^}]*var\(--clv-motion-progress-duration\)/s,
    );
  });

  it("anima popovers sem interpolar as sombras de Elevation", () => {
    for (const selector of [".clv-select__popover", ".clv-combobox__popover"]) {
      const popover = rule(selector);
      expect(popover).toContain("opacity var(--clv-motion-enter-duration)");
      expect(popover).toContain("transform var(--clv-motion-enter-duration)");
      expect(popover).not.toContain("box-shadow var(--clv-motion");
    }
  });

  it("não mantém transition all no CSS público", () => {
    expect(css).not.toMatch(/transition\s*:\s*all\b/);
  });

  it("mantém o loading contínuo no token de ciclo e o desliga no modo reduzido", () => {
    expect(css).toContain(
      "animation: clv-spin var(--clv-motion-cycle-loading) var(--clv-motion-easing-linear) infinite",
    );
    expect(css).toContain(".clv-loading-state__spinner");
    expect(css).toContain("animation: none;");
  });
});
