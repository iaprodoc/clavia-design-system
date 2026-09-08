import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

describe("adoção da Focus Foundation", () => {
  it("aplica o outline canônico aos pilotos sem depender da sombra", () => {
    const contract = css.slice(css.indexOf("/*\n * Focus Foundation"));
    expect(contract).toContain(
      "outline: var(--clv-focus-width) var(--clv-focus-style) var(--clv-color-focus-outline)",
    );
    for (const selector of [
      ".clv-button:focus-visible",
      ".clv-input:focus-visible",
      ".clv-checkbox__control:focus-visible",
      '.clv-tabs__tab[data-focus-visible="true"]',
      '.clv-slider__thumb[data-focus-visible="true"]',
    ]) {
      expect(contract, selector).toContain(selector);
    }
  });

  it("promove o foco visível do Combobox sem apagar o estado inválido", () => {
    expect(css).toContain(".clv-combobox__input-group:has(.clv-combobox__input:focus-visible)");
    expect(css).toContain("box-shadow: inset 0 0 0 1px var(--clv-field-control-border-error)");
  });

  it("mantém adaptação inset para tabelas com overflow recortado", () => {
    expect(css).toContain(
      "box-shadow: inset 0 0 0 var(--clv-focus-width) var(--clv-color-focus-outline)",
    );
    expect(css).toContain("outline-offset: calc(0px - var(--clv-focus-width))");
  });

  it("oferece contraste em superfícies escuras e forced colors", () => {
    expect(css).toContain("outline-color: var(--clv-color-text-inverse)");
    const forcedColors = css.slice(css.lastIndexOf("@media (forced-colors: active)"));
    expect(forcedColors).toContain("outline-color: Highlight");
  });

  it("normaliza controles declarados depois do contrato de Focus", () => {
    for (const selector of [
      ".clv-action-card:focus-visible",
      ".clv-navigation-card:focus-visible",
      '.clv-popover__trigger[data-focus-visible="true"]',
      '.clv-dropdown-menu__trigger[data-focus-visible="true"]',
      ".clv-operational-alert__content summary:focus-visible",
    ]) {
      expect(css, selector).toContain(selector);
    }

    const lateContract = css.slice(css.lastIndexOf("/* Focus Foundation: primitives"));
    expect(lateContract).toContain(
      "outline: var(--clv-focus-width) var(--clv-focus-style) var(--clv-color-focus-outline)",
    );
  });
});
