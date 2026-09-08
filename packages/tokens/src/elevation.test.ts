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
      (match[2] as string).replace(/\s+/g, " ").trim(),
    ]),
  );
}

describe("contrato de elevation", () => {
  const css = rootVariables();

  it("mantém os cinco papéis canônicos equivalentes em TypeScript, JSON e CSS", () => {
    const canonical = ["flat", "raised", "lifted", "floating", "overlay"] as const;

    for (const name of canonical) {
      expect(tokenAt(["elevation", name])).toEqual({
        $type: "string",
        $value: tokens.elevation[name],
      });
      expect(css.get(`--clv-elevation-${name}`)).toBe(
        tokens.elevation[name].replace(/\s+/g, " ").trim(),
      );
    }
  });

  it("preserva interactive somente como compatibilidade e não o usa em componentes", () => {
    expect(tokenAt(["elevation", "interactive"])).toEqual({
      $type: "string",
      $value: tokens.elevation.interactive,
    });
    expect(css.get("--clv-elevation-interactive")).toBe(
      tokens.elevation.interactive.replace(/\s+/g, " ").trim(),
    );
    expect(JSON.stringify(tokens.component)).not.toContain(tokens.elevation.interactive);
  });

  it("mapeia pilotos por função sem reservar overlay para conteúdo não bloqueante", () => {
    expect(tokens.component.select.popover.shadow).toBe(tokens.elevation.floating);
    expect(tokens.component.tooltip.shadow).toBe(tokens.elevation.floating);
    expect(tokens.component.stepCard.interactiveShadow).toBe(tokens.elevation.raised);
    expect(tokens.component.stickyActionBar.shadow).toBe(tokens.elevation.floating);
    expect(tokens.component.alert.featured.shadow).toBe(tokens.elevation.lifted);
    expect(tokens.component.alert.shadow).toBe(tokens.elevation.raised);
  });

  it("mantém foco, efeitos expressivos, borda, radius e empilhamento fora do contrato", () => {
    expect(Object.keys(tokens.elevation)).toEqual([
      "flat",
      "raised",
      "lifted",
      "floating",
      "interactive",
      "overlay",
    ]);
    expect(tokens.control.focusRing).toBeDefined();
    expect(tokens.effect.glow).toBeDefined();
    expect(tokens.border).toBeDefined();
    expect(tokens.radius).toBeDefined();
    expect(JSON.stringify(tokens.elevation)).not.toMatch(/z-index|blur\(|inset/);
  });

  it("mantém elevation independente de viewport e densidade", () => {
    const compact = cssSource.match(/\[data-clv-density="compact"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(compact).not.toMatch(/--clv-elevation-/);
    expect(cssSource).not.toMatch(/@media[^{}]*\{[^{}]*--clv-elevation-/);
  });
});
