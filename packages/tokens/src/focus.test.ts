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
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]?.trim()]),
  );
}

describe("contrato de focus", () => {
  const css = rootVariables();

  it("mantém geometria equivalente em TypeScript, JSON e CSS", () => {
    expect(tokens.focus).toEqual({ offset: "0.125rem", style: "solid", width: "2px" });
    expect(tokenAt(["focus", "width"])).toEqual({
      $type: "dimension",
      $value: "{border.width.thick}",
    });
    expect(tokenAt(["focus", "style"])).toEqual({
      $type: "string",
      $value: "{border.style.solid}",
    });
    expect(tokenAt(["focus", "offset"])).toEqual({
      $type: "dimension",
      $value: "{space.0_5}",
    });
    expect(css.get("--clv-focus-width")).toBe("var(--clv-border-width-thick)");
    expect(css.get("--clv-focus-style")).toBe("var(--clv-border-style-solid)");
    expect(css.get("--clv-focus-offset")).toBe("var(--clv-space-0-5)");
  });

  it("delega cor, espessura e estilo às foundations proprietárias", () => {
    expect(tokens.color.focus.outline).toBe("#224E82");
    expect(tokens.focus.width).toBe(tokens.border.width.thick);
    expect(tokens.focus.style).toBe(tokens.border.style.solid);
    expect(tokens.focus.offset).toBe(tokens.space["0_5"]);
  });

  it("preserva aliases de compatibilidade sem absorvê-los no contrato canônico", () => {
    expect(tokens.color.border.focus).toBe(tokens.color.focus.outline);
    expect(tokens.control.focusRing).toContain(tokens.color.focus.ring);
    expect(css.get("--clv-focus-ring")).toBe("0 0 0 3px var(--clv-color-focus-ring)");
    expect(Object.keys(tokens.focus)).toEqual(["width", "style", "offset"]);
  });

  it("não varia geometria por densidade ou viewport", () => {
    const compact = cssSource.match(/\[data-clv-density="compact"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(compact).not.toMatch(/--clv-focus-(?:width|style|offset)/);
    expect(cssSource).not.toMatch(/@media[^{}]*\{[^{}]*--clv-focus-(?:width|style|offset)/);
  });
});
