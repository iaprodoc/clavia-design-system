import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { tokens } from "./index";
import tokenSource from "./tokens.json";

type TokenLeaf = {
  $type: string;
  $value: unknown;
};

interface TokenTree {
  [key: string]: TokenLeaf | TokenTree;
}

const cssSource = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

function isTokenLeaf(value: unknown): value is TokenLeaf {
  return Boolean(value && typeof value === "object" && "$value" in value);
}

function flattenTokens(tree: TokenTree, prefix: string[] = []) {
  const result: Array<{ path: string[]; token: TokenLeaf }> = [];

  for (const [name, value] of Object.entries(tree)) {
    const path = [...prefix, name];

    if (isTokenLeaf(value)) {
      result.push({ path, token: value });
    } else {
      result.push(...flattenTokens(value, path));
    }
  }

  return result;
}

function getPath(root: unknown, path: string[]) {
  return path.reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    return (value as Record<string, unknown>)[segment];
  }, root);
}

function resolveJsonToken(path: string[], visited = new Set<string>()): unknown {
  const key = path.join(".");

  if (visited.has(key)) {
    throw new Error(`Alias circular no JSON: ${key}`);
  }

  visited.add(key);
  const token = getPath(tokenSource, path);

  if (!isTokenLeaf(token)) {
    throw new Error(`Token JSON não encontrado: ${key}`);
  }

  if (typeof token.$value === "string") {
    const alias = token.$value.match(/^\{([^}]+)\}$/)?.[1];

    if (alias) {
      return resolveJsonToken(alias.split("."), visited);
    }
  }

  return token.$value;
}

function parseCssVariables() {
  const variables = new Map<string, string>();

  for (const match of cssSource.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    const [, name, value] = match;

    if (name && value) {
      variables.set(name, value.trim().replace(/\s+/g, " "));
    }
  }

  return variables;
}

const cssVariables = parseCssVariables();

function resolveCssVariable(name: string, visited = new Set<string>()): string {
  if (visited.has(name)) {
    throw new Error(`Alias circular no CSS: ${name}`);
  }

  visited.add(name);
  const value = cssVariables.get(name);

  if (!value) {
    throw new Error(`Custom property não encontrada: ${name}`);
  }

  const alias = value.match(/^var\(\s*(--[\w-]+)\s*\)$/)?.[1];

  return alias ? resolveCssVariable(alias, visited) : value;
}

function toKebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function colorCssName(path: string[]) {
  const key = path.join(".");

  if (key === "color.primitive.static.white") {
    return "--clv-color-static-white";
  }

  if (key === "color.primitive.static.black") {
    return "--clv-color-static-black";
  }

  if (key === "color.accent.default") {
    return "--clv-color-accent";
  }

  return `--clv-${path.map(toKebabCase).join("-")}`;
}

function componentCssName(path: string[]) {
  const exceptions: Record<string, string> = {
    "progress.indicator": "--clv-progress-indicator-background",
    "progress.meta": "--clv-progress-meta-text",
    "progress.track": "--clv-progress-track-background",
    "stickyActionBar.onDark.surface.border": "--clv-sticky-action-bar-on-dark-border",
    "stickyActionBar.onDark.surface.outline": "--clv-sticky-action-bar-on-dark-outline",
  };
  const exception = exceptions[path.join(".")];

  if (exception) {
    return exception;
  }

  return `--clv-${path.map(toKebabCase).join("-")}`;
}

function normalizeColor(value: unknown) {
  if (typeof value !== "string") {
    throw new Error(`Valor de cor inválido: ${String(value)}`);
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "transparent") {
    return [0, 0, 0, 0];
  }

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);
    const expanded =
      hex.length === 3 || hex.length === 4
        ? [...hex].map((character) => `${character}${character}`).join("")
        : hex;

    if (expanded.length !== 6 && expanded.length !== 8) {
      throw new Error(`Hexadecimal de cor inválido: ${value}`);
    }

    return [
      Number.parseInt(expanded.slice(0, 2), 16),
      Number.parseInt(expanded.slice(2, 4), 16),
      Number.parseInt(expanded.slice(4, 6), 16),
      expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1,
    ];
  }

  if (normalized.startsWith("rgb")) {
    const channels = normalized.match(/[\d.]+%?/g);

    if (!channels || channels.length < 3) {
      throw new Error(`RGB de cor inválido: ${value}`);
    }

    const alpha = channels[3]
      ? channels[3].endsWith("%")
        ? Number.parseFloat(channels[3]) / 100
        : Number.parseFloat(channels[3])
      : 1;

    return [
      Number.parseFloat(channels[0] ?? "0"),
      Number.parseFloat(channels[1] ?? "0"),
      Number.parseFloat(channels[2] ?? "0"),
      alpha,
    ];
  }

  throw new Error(`Formato de cor não suportado: ${value}`);
}

describe("paridade dos tokens de cor", () => {
  it("mantém primitivas e aliases semânticos equivalentes em JSON, TypeScript e CSS", () => {
    const colorTokens = flattenTokens(tokenSource.color as TokenTree, ["color"]);

    expect(colorTokens).toHaveLength(151);

    for (const { path } of colorTokens) {
      const typescriptValue = getPath(tokens, path);
      const jsonValue = resolveJsonToken(path);
      const cssValue = resolveCssVariable(colorCssName(path));

      expect(normalizeColor(typescriptValue), `TypeScript ↔ JSON: ${path.join(".")}`).toEqual(
        normalizeColor(jsonValue),
      );
      expect(normalizeColor(cssValue), `CSS ↔ JSON: ${path.join(".")}`).toEqual(
        normalizeColor(jsonValue),
      );
    }
  });

  it("mantém tokens de componente tipados como cor equivalentes nos três formatos", () => {
    const componentColors = flattenTokens(tokenSource.component as TokenTree).filter(
      ({ token }) => token.$type === "color",
    );

    expect(componentColors.length).toBeGreaterThan(200);

    for (const { path } of componentColors) {
      const typescriptValue = getPath(tokens.component, path);
      const jsonValue = resolveJsonToken(["component", ...path]);
      const cssValue = resolveCssVariable(componentCssName(path));

      expect(
        normalizeColor(typescriptValue),
        `TypeScript ↔ JSON: component.${path.join(".")}`,
      ).toEqual(normalizeColor(jsonValue));
      expect(normalizeColor(cssValue), `CSS ↔ JSON: component.${path.join(".")}`).toEqual(
        normalizeColor(jsonValue),
      );
    }
  });

  it("reserva primitivas à fundação e mantém o alias compatível de foco", () => {
    const componentColors = flattenTokens(tokenSource.component as TokenTree);
    const primitiveReferences = componentColors.filter(
      ({ token }) =>
        token.$type === "color" &&
        typeof token.$value === "string" &&
        token.$value.includes("{color.primitive."),
    );

    expect(primitiveReferences).toEqual([]);
    expect(tokenSource.color.border.focus.$value).toBe("{color.focus.outline}");
    expect(tokens.color.border.focus).toBe(tokens.color.focus.outline);
    expect(tokens.control.focusRing).toContain(tokens.color.focus.ring);
    expect(cssVariables.get("--clv-color-border-focus")).toBe("var(--clv-color-focus-outline)");
  });
});
