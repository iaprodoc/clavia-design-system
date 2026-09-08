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

function rootVariables() {
  const block = cssSource.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  return new Map(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1] as string,
      (match[2] as string).trim(),
    ]),
  );
}

describe("contrato de border", () => {
  const css = rootVariables();

  it("mantém larguras equivalentes em TypeScript, JSON e CSS", () => {
    expect(tokens.border.width).toEqual({ none: "0px", thick: "2px", thin: "1px" });

    for (const [name, value] of Object.entries(tokens.border.width)) {
      expect(tokenAt(["border", "width", name])).toEqual({
        $type: "dimension",
        $value: value,
      });
      expect(css.get(`--clv-border-width-${name}`)).toBe(value);
    }
  });

  it("mantém estilos equivalentes em TypeScript, JSON e CSS", () => {
    expect(tokens.border.style).toEqual({ dashed: "dashed", none: "none", solid: "solid" });

    for (const [name, value] of Object.entries(tokens.border.style)) {
      expect(tokenAt(["border", "style", name])).toEqual({ $type: "string", $value: value });
      expect(css.get(`--clv-border-style-${name}`)).toBe(value);
    }
  });

  it("não cria uma camada semântica de largura nem absorve cor, foco ou radius", () => {
    expect(Object.keys(tokens.border)).toEqual(["width", "style"]);
    expect(tokens.color.border).toBeDefined();
    expect(tokens.color.focus).toBeDefined();
    expect(tokens.radius).toBeDefined();
    expect(tokens.shape).toBeDefined();
  });

  it("mantém border independente de estado, viewport e densidade", () => {
    const compact = cssSource.match(/\[data-clv-density="compact"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(compact).not.toMatch(/--clv-border-(?:width|style)-/);
    expect(cssSource).not.toMatch(/@media[^{}]*\{[^{}]*--clv-border-(?:width|style)-/);
  });

  it("preserva o indicador de Tabs como exceção do componente", () => {
    expect(tokens.component.tabs.indicator.thickness).toBe("2px");
  });
});
