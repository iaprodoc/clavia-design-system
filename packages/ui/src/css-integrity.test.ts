import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const tokenCss = readFileSync(resolve(process.cwd(), "../tokens/src/tokens.css"), "utf8");
const uiCss = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

const runtimeAllowlist = new Set<string>();

function customPropertyDefinitions(...sources: string[]) {
  return new Set(
    sources.flatMap((source) =>
      [...source.matchAll(/(--clv-[\w-]+)\s*:/g)].map((match) => match[1] as string),
    ),
  );
}

function customPropertyReferences(source: string) {
  return [...source.matchAll(/var\(\s*(--clv-[\w-]+)/g)].map((match) => match[1] as string);
}

function undefinedReferences(source: string, definitions: Set<string>) {
  return [
    ...new Set(
      customPropertyReferences(source).filter(
        (reference) => !definitions.has(reference) && !runtimeAllowlist.has(reference),
      ),
    ),
  ].sort();
}

describe("integridade das referências CSS públicas", () => {
  const definitions = customPropertyDefinitions(tokenCss, uiCss);

  it("resolve toda referência --clv-* do CSS-fonte contra tokens ou variáveis internas", () => {
    expect(runtimeAllowlist, "a distribuição não depende de variáveis criadas em runtime").toEqual(
      new Set(),
    );
    expect(undefinedReferences(uiCss, definitions)).toEqual([]);
  });

  it("rejeita a reintrodução de uma referência inválida conhecida", () => {
    const regression = ".clv-regression { padding: var(--clv-spacing-3); }";

    expect(undefinedReferences(regression, definitions)).toEqual(["--clv-spacing-3"]);
  });

  it("não preserva aliases silenciosos para os nomes inválidos auditados", () => {
    for (const invalidName of [
      "--clv-radius-overlay",
      "--clv-radius-surface",
      "--clv-z-index-modal",
      "--clv-color-text-disabled",
      "--clv-color-text-success",
      "--clv-color-text-warning",
      "--clv-color-text-danger",
    ]) {
      expect(definitions.has(invalidName), invalidName).toBe(false);
    }
  });
});
