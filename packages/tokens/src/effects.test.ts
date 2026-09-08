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

describe("contrato de Effects", () => {
  const css = rootVariables();

  const canonical = [
    { group: "blur", jsonValue: "32px", name: "brandMedia", value: tokens.effect.blur.brandMedia },
    {
      group: "blur",
      jsonValue: "2px",
      name: "brandSurface",
      value: tokens.effect.blur.brandSurface,
    },
    {
      group: "blur",
      jsonValue: "16px",
      name: "floatingSurface",
      value: tokens.effect.blur.floatingSurface,
    },
    {
      group: "blur",
      jsonValue: "4px",
      name: "glassControl",
      value: tokens.effect.blur.glassControl,
    },
    {
      group: "glow",
      jsonValue: tokens.effect.glow.brand,
      name: "brand",
      value: tokens.effect.glow.brand,
    },
    {
      group: "highlight",
      jsonValue: tokens.effect.highlight.brand,
      name: "brand",
      value: tokens.effect.highlight.brand,
    },
    {
      group: "highlight",
      jsonValue: tokens.effect.highlight.brandSurface,
      name: "brandSurface",
      value: tokens.effect.highlight.brandSurface,
    },
    {
      group: "highlight",
      jsonValue: tokens.effect.highlight.glassControl,
      name: "glassControl",
      value: tokens.effect.highlight.glassControl,
    },
  ] as const;

  it("mantém os oito papéis canônicos equivalentes em TypeScript, JSON e CSS", () => {
    for (const { group, jsonValue, name, value } of canonical) {
      const json = tokenAt(["effect", group, name]);
      const cssName = `--clv-effect-${group}-${name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

      expect(json).toEqual({
        $type: group === "blur" ? "dimension" : "string",
        $value: jsonValue,
      });
      expect(css.get(cssName)).toBe(value.replace(/\s+/g, " ").trim());
    }
  });

  it("preserva somente aliases preliminares com consumidor ou risco de compatibilidade", () => {
    expect(tokens.effect.blur.brand).toBe(tokens.effect.blur.brandMedia);
    expect(tokens.effect.glass.backdropBlur).toBe(tokens.effect.blur.glassControl);
    expect(tokens.effect.glass.shadow).toBe(tokens.effect.highlight.glassControl);
    expect(css.get("--clv-effect-blur-brand")).toBe("var(--clv-effect-blur-brand-media)");
    expect(css.get("--clv-effect-glass-backdrop-blur")).toBe(
      "var(--clv-effect-blur-glass-control)",
    );
    expect(css.get("--clv-effect-glass-shadow")).toBe("var(--clv-effect-highlight-glass-control)");
  });

  it("remove parâmetros físicos sem efeito implementado do contrato público", () => {
    const source = JSON.stringify(tokenSource.effect);
    expect(source).not.toMatch(/depth|dispersion|refraction|lightAngle|lightIntensity/);
  });

  it("mapeia somente consumidores expressivos comprovados", () => {
    expect(tokens.component.button.glass.backdropBlur).toBe(tokens.effect.blur.glassControl);
    expect(tokens.component.button.glass.shadow).toBe(tokens.effect.highlight.glassControl);
    expect(tokens.component.brandPanel.backdropBlur).toBe(tokens.effect.blur.brandSurface);
    expect(tokens.component.brandPanel.description).toBe(tokens.color.text.inverse);
    expect(tokens.component.brandPanel.eyebrow).toBe(tokens.color.text.inverse);
    expect(tokens.component.brandPanel.media.backdropBlur).toBe(tokens.effect.blur.brandMedia);
    expect(tokens.component.stickyActionBar.backdropBlur).toBe(tokens.effect.blur.floatingSurface);
  });

  it("mantém elevation, focus, motion, gradientes e stacking fora de Effects", () => {
    const effectSource = JSON.stringify(tokens.effect);
    expect(effectSource).not.toMatch(/z-index|duration|easing|linear-gradient|radial-gradient/);
    expect(tokens.component.stickyActionBar.shadow).toBe(tokens.elevation.floating);
    expect(tokens.component.button.gradient.background).toBe(tokens.gradient.surface.action);
    expect(tokens.focus).toBeDefined();
    expect(tokens.motion).toBeDefined();
  });

  it("mantém Effects independente de viewport, densidade e preferência de movimento", () => {
    const compact = cssSource.match(/\[data-clv-density="compact"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(compact).not.toMatch(/--clv-effect-/);
    expect(cssSource).not.toMatch(/@media[^{}]*\{[^{}]*--clv-effect-/);
  });
});
