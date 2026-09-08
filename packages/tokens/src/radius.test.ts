import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { tokens } from "./index";
import tokenSource from "./tokens.json";

type TokenLeaf = { $type: string; $value: unknown };

const cssSource = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

function tokenAt(path: string[]) {
  return path.reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, tokenSource) as TokenLeaf | undefined;
}

function resolveJson(path: string[], visited = new Set<string>()): unknown {
  const key = path.join(".");
  if (visited.has(key)) throw new Error(`Alias circular no JSON: ${key}`);
  visited.add(key);

  const token = tokenAt(path);
  if (!token || !("$value" in token)) throw new Error(`Token ausente no JSON: ${key}`);

  if (typeof token.$value === "string") {
    const alias = token.$value.match(/^\{([^}]+)\}$/)?.[1];
    if (alias) return resolveJson(alias.split("."), visited);
  }

  return token.$value;
}

function rootVariables() {
  const block = cssSource.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  return new Map(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1] as string,
      (match[2] as string).trim(),
    ]),
  );
}

function resolveCss(
  name: string,
  variables: Map<string, string>,
  visited = new Set<string>(),
): string {
  if (visited.has(name)) throw new Error(`Alias circular no CSS: ${name}`);
  visited.add(name);
  const value = variables.get(name);
  if (!value) throw new Error(`Custom property ausente: ${name}`);
  const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return alias ? resolveCss(alias, variables, visited) : value;
}

function pixels(value: unknown) {
  if (typeof value !== "string") throw new Error(`Dimensão inválida: ${String(value)}`);
  if (value.endsWith("rem")) return Number.parseFloat(value) * 16;
  if (value.endsWith("px")) return Number.parseFloat(value);
  throw new Error(`Unidade não suportada: ${value}`);
}

describe("contrato de radius", () => {
  const css = rootVariables();

  it("mantém as sete primitivas equivalentes em TypeScript, JSON e CSS", () => {
    expect(Object.keys(tokens.radius)).toEqual(["none", "xs", "sm", "md", "lg", "xl", "pill"]);

    for (const [name, value] of Object.entries(tokens.radius)) {
      const json = resolveJson(["radius", name]);
      const cssValue = resolveCss(`--clv-radius-${name}`, css);
      expect(pixels(value), `TypeScript ↔ JSON: radius.${name}`).toBe(pixels(json));
      expect(pixels(cssValue), `CSS ↔ JSON: radius.${name}`).toBe(pixels(json));
    }
  });

  it("publica cinco papéis semânticos sem criar uma segunda escala", () => {
    expect(tokens.shape).toEqual({
      control: tokens.radius.md,
      none: tokens.radius.none,
      overlay: tokens.radius.lg,
      pill: tokens.radius.pill,
      surface: tokens.radius.lg,
    });

    for (const name of Object.keys(tokens.shape) as Array<keyof typeof tokens.shape>) {
      expect(pixels(resolveCss(`--clv-shape-${name}`, css))).toBe(pixels(tokens.shape[name]));
      expect(pixels(resolveJson(["shape", name]))).toBe(pixels(tokens.shape[name]));
    }
  });

  it("faz os pilotos consumirem papéis ou primitivas intencionais", () => {
    expect(tokens.component.checkbox.control.radius).toBe(tokens.radius.xs);
    expect(tokens.component.textarea.radius).toBe(tokens.shape.control);
    expect(tokens.component.tabs.radius).toBe(tokens.shape.pill);
    expect(tokens.component.tabs.list.radius).toBe(tokens.space[5]);
    expect(tokens.component.tabs.tab.radius).toBe(tokens.shape.pill);
    expect(tokens.component.table.radius).toBe(tokens.shape.surface);
    expect(tokens.component.tooltip.radius).toBe(tokens.shape.overlay);
    expect(tokens.component.statusBadge.radius).toBe(tokens.shape.pill);

    expect(css.get("--clv-checkbox-control-radius")).toBe("var(--clv-radius-xs)");
    expect(css.get("--clv-table-radius")).toBe("var(--clv-shape-surface)");
    expect(css.get("--clv-tooltip-radius")).toBe("var(--clv-shape-overlay)");
  });

  it("mantém radius independente de estado, viewport e densidade", () => {
    const compact = cssSource.match(/\[data-clv-density="compact"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(compact).not.toMatch(/--clv-(?:radius|shape)-/);
    expect(cssSource).not.toMatch(/@media[^{}]*\{[^{}]*--clv-(?:radius|shape)-/);
  });
});
