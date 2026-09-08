import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
}

describe("adoção da Border Foundation", () => {
  it("aplica thin solid nos pilotos que usam contorno", () => {
    for (const selector of [
      ".clv-button",
      ".clv-checkbox__control",
      ".clv-alert",
      ".clv-status-badge",
      ".clv-file-upload__file",
    ]) {
      expect(rule(selector), selector).toContain(
        "border: var(--clv-border-width-thin) var(--clv-border-style-solid)",
      );
    }
  });

  it("mantém Tabs primária sem contorno e reserva a borda para o trilho secundário", () => {
    expect(rule(".clv-tabs__list-container")).toContain("border: 0");
    expect(rule(".clv-tabs--secondary .clv-tabs__list-container")).toContain(
      "border-block-end: var(--clv-tabs-list-track-thickness)",
    );
  });

  it("reserva thick dashed para a área de envio", () => {
    expect(rule(".clv-file-upload__dropzone")).toContain(
      "border: var(--clv-border-width-thick) var(--clv-border-style-dashed)",
    );
  });

  it("usa propriedades lógicas em emendas e divisores", () => {
    expect(css).toContain("border-inline-end-color: transparent");
    expect(rule(".clv-table__row .clv-table__cell")).toContain(
      "border-block-end: var(--clv-border-width-thin)",
    );
    expect(css).toContain("border-inline-start: var(--clv-tabs-list-track-thickness)");
    expect(css).not.toMatch(/border-(?:left|right):\s*var\(--clv-tabs-list-track-thickness\)/);
  });

  it("delega foco à foundation própria e preserva o indicador de Tabs", () => {
    expect(css).toContain("outline: var(--clv-focus-width) var(--clv-focus-style)");
    expect(css).toContain(
      "border-block-end: var(--clv-tabs-list-track-thickness) var(--clv-border-style-solid)",
    );
  });
});
