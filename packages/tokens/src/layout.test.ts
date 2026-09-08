import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { tokens } from "./index";
import tokenSource from "./tokens.json";

type TokenLeaf = { $type: string; $value: unknown };

const cssSource = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

function getPath(root: unknown, path: string[]) {
  return path.reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, root);
}

function isTokenLeaf(value: unknown): value is TokenLeaf {
  return Boolean(value && typeof value === "object" && "$value" in value);
}

function resolveJsonToken(path: string[], visited = new Set<string>()): unknown {
  const key = path.join(".");
  if (visited.has(key)) throw new Error(`Alias circular no JSON: ${key}`);

  visited.add(key);
  const token = getPath(tokenSource, path);
  if (!isTokenLeaf(token)) throw new Error(`Token JSON não encontrado: ${key}`);

  if (typeof token.$value === "string") {
    const alias = token.$value.match(/^\{([^}]+)\}$/)?.[1];
    if (alias) return resolveJsonToken(alias.split("."), visited);
  }

  return token.$value;
}

function toPixels(value: unknown) {
  if (typeof value !== "string") throw new Error(`Dimensão inválida: ${String(value)}`);
  if (value.endsWith("rem")) return Number.parseFloat(value) * 16;
  if (value.endsWith("px")) return Number.parseFloat(value);
  throw new Error(`Unidade não suportada: ${value}`);
}

function cssVariables() {
  return new Map(
    [...cssSource.matchAll(/(--clv-layout-[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2]?.trim(),
    ]),
  );
}

describe("contrato de layout", () => {
  const css = cssVariables();

  it("mantém breakpoints e containers equivalentes em JSON, TypeScript e CSS", () => {
    for (const family of ["breakpoint", "container"] as const) {
      for (const [name, value] of Object.entries(tokens.layout[family])) {
        const jsonValue = resolveJsonToken(["layout", family, name]);
        const cssValue = css.get(`--clv-layout-${family}-${name}`);

        expect(toPixels(value), `TypeScript ↔ JSON: layout.${family}.${name}`).toBe(
          toPixels(jsonValue),
        );
        expect(toPixels(cssValue), `CSS ↔ JSON: layout.${family}.${name}`).toBe(
          toPixels(jsonValue),
        );
      }
    }
  });

  it("publica uma grade progressiva 4 / 8 / 12", () => {
    expect(tokens.layout.grid.columns).toEqual({ compact: 4, regular: 8, wide: 12 });

    for (const [name, value] of Object.entries(tokens.layout.grid.columns)) {
      expect(resolveJsonToken(["layout", "grid", "columns", name])).toBe(value);
      expect(Number(css.get(`--clv-layout-grid-columns-${name}`))).toBe(value);
    }
  });

  it("faz gutter e gap referenciarem a fundação de Spacing", () => {
    expect(tokenSource.layout.gutter.compact.$value).toBe("{spacing.gutter.sm}");
    expect(tokenSource.layout.gutter.regular.$value).toBe("{spacing.gutter.md}");
    expect(tokenSource.layout.gutter.wide.$value).toBe("{spacing.gutter.lg}");
    expect(tokenSource.layout.grid.gap.regular.$value).toBe("{spacing.default.grid.lg}");

    expect(css.get("--clv-layout-gutter-compact")).toBe("var(--clv-spacing-gutter-sm)");
    expect(css.get("--clv-layout-grid-gap-wide")).toBe("var(--clv-spacing-grid-lg)");
  });

  it("mantém as faixas ordenadas e garante reflow a partir de 320 px", () => {
    const breakpoints = Object.values(tokens.layout.breakpoint).map(toPixels);
    const containers = Object.values(tokens.layout.container).map(toPixels);

    expect(breakpoints).toEqual([...breakpoints].sort((a, b) => a - b));
    expect(containers).toEqual([...containers].sort((a, b) => a - b));
    expect(320).toBeLessThan(toPixels(tokens.layout.breakpoint.regular));
  });
});
