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

describe("contrato de motion", () => {
  const css = rootVariables();

  it("mantém as durações primitivas em paridade", () => {
    for (const name of ["instant", "fast", "moderate", "slow"] as const) {
      expect(tokenAt(["motion", "duration", name])).toEqual({
        $type: "duration",
        $value: tokens.motion.duration[name],
      });
      expect(css.get(`--clv-motion-duration-${name}`)).toBe(tokens.motion.duration[name]);
    }
  });

  it("mantém os easings em paridade", () => {
    const values = {
      accelerate: [0.4, 0, 1, 1],
      decelerate: [0, 0, 0.2, 1],
      linear: [0, 0, 1, 1],
      standard: [0.2, 0, 0, 1],
    } as const;

    for (const name of Object.keys(values) as (keyof typeof values)[]) {
      expect(tokenAt(["motion", "easings", name])).toEqual({
        $type: "cubicBezier",
        $value: values[name],
      });
      expect(tokens.motion.easings[name]).toBeDefined();
      expect(css.get(`--clv-motion-easing-${name}`)).toBe(tokens.motion.easings[name]);
    }
  });

  it("separa papéis discretos de ciclos contínuos", () => {
    expect(tokens.motion.role.feedback.duration).toBe(tokens.motion.duration.fast);
    expect(tokens.motion.role.state.duration).toBe(tokens.motion.duration.moderate);
    expect(tokens.motion.role.enter.duration).toBe(tokens.motion.duration.slow);
    expect(tokens.motion.role.exit.duration).toBe(tokens.motion.duration.moderate);
    expect(tokens.motion.role.progress.duration).toBe(tokens.motion.duration.slow);
    expect(tokens.motion.cycle.loading).toBe("800ms");
    expect(tokens.motion.cycle.ambient).toBe("1600ms");
    expect(tokens.motion.cycle.skeleton).toBe("1800ms");
  });

  it("preserva aliases públicos existentes", () => {
    expect(tokens.motion.duration.fast).toBe("120ms");
    expect(tokens.motion.duration.normal).toBe("180ms");
    expect(tokens.motion.duration.enter).toBe("240ms");
    expect(tokens.motion.duration.ambient).toBe("1600ms");
    expect(tokens.motion.easing).toBe(tokens.motion.easings.standard);
  });

  it("reduz papéis discretos sem zerar ciclos infinitos", () => {
    const reduced = cssSource.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{([\s\S]*?)\n\s*\}/,
    )?.[1];

    expect(reduced).toContain("--clv-motion-enter-duration: 0ms");
    expect(reduced).toContain("--clv-motion-exit-duration: 0ms");
    expect(reduced).toContain("--clv-motion-progress-duration: 0ms");
    expect(reduced).not.toContain("--clv-motion-cycle-loading: 0ms");
    expect(reduced).not.toContain("--clv-motion-cycle-ambient: 0ms");
    expect(reduced).not.toContain("--clv-motion-cycle-skeleton: 0ms");
  });
});
