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
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, root);
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

function dimensionToPixels(value: unknown) {
  if (typeof value !== "string") throw new Error(`Dimensão inválida: ${String(value)}`);
  if (value.endsWith("rem")) return Number.parseFloat(value) * 16;
  if (value.endsWith("px")) return Number.parseFloat(value);
  throw new Error(`Unidade de dimensão não suportada: ${value}`);
}

function cssBlock(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = cssSource.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1];
  if (!block) throw new Error(`Bloco CSS não encontrado: ${selector}`);
  return block;
}

function parseCssVariables(source: string) {
  const variables = new Map<string, string>();

  for (const match of source.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    const [, name, value] = match;
    if (name && value) variables.set(name, value.trim().replace(/\s+/g, " "));
  }

  return variables;
}

function resolveCssVariable(
  name: string,
  variables: Map<string, string>,
  visited = new Set<string>(),
): string {
  if (visited.has(name)) throw new Error(`Alias circular no CSS: ${name}`);

  visited.add(name);
  const value = variables.get(name);
  if (!value) throw new Error(`Custom property não encontrada: ${name}`);

  const alias = value.match(/^var\(\s*(--[\w-]+)\s*\)$/)?.[1];
  return alias ? resolveCssVariable(alias, variables, visited) : value;
}

function semanticCssName(path: string[]) {
  const normalized = path[0] === "default" || path[0] === "compact" ? path.slice(1) : path;
  return `--clv-spacing-${normalized.join("-")}`;
}

describe("contrato de spacing", () => {
  const rootVariables = parseCssVariables(cssBlock(":root"));
  const compactVariables = new Map([
    ...rootVariables,
    ...parseCssVariables(cssBlock('[data-clv-density="compact"]')),
  ]);

  it("mantém as 14 primitivas equivalentes em JSON, TypeScript e CSS", () => {
    expect(Object.keys(tokens.space)).toHaveLength(14);

    for (const [name, typescriptValue] of Object.entries(tokens.space)) {
      const jsonValue = resolveJsonToken(["space", name]);
      const cssName = `--clv-space-${name.replace("_", "-")}`;
      const cssValue = resolveCssVariable(cssName, rootVariables);

      expect(dimensionToPixels(typescriptValue), `TypeScript ↔ JSON: space.${name}`).toBe(
        dimensionToPixels(jsonValue),
      );
      expect(dimensionToPixels(cssValue), `CSS ↔ JSON: space.${name}`).toBe(
        dimensionToPixels(jsonValue),
      );
    }
  });

  it("publica 26 papéis semânticos com default, compact e invariantes", () => {
    const semanticTokens = flattenTokens(tokenSource.spacing as TokenTree);

    expect(semanticTokens).toHaveLength(45);

    for (const { path } of semanticTokens) {
      const typescriptValue = getPath(tokens.spacing, path);
      const jsonValue = resolveJsonToken(["spacing", ...path]);
      const variables = path[0] === "compact" ? compactVariables : rootVariables;
      const cssValue = resolveCssVariable(semanticCssName(path), variables);

      expect(dimensionToPixels(typescriptValue), `TypeScript ↔ JSON: ${path.join(".")}`).toBe(
        dimensionToPixels(jsonValue),
      );
      expect(dimensionToPixels(cssValue), `CSS ↔ JSON: ${path.join(".")}`).toBe(
        dimensionToPixels(jsonValue),
      );
    }
  });

  it("mantém section e gutter invariantes entre densidades", () => {
    const compactBlock = parseCssVariables(cssBlock('[data-clv-density="compact"]'));

    for (const name of [
      ...Object.keys(tokens.spacing.section),
      ...Object.keys(tokens.spacing.gutter),
    ]) {
      expect(compactBlock.has(`--clv-spacing-section-${name}`)).toBe(false);
      expect(compactBlock.has(`--clv-spacing-gutter-${name}`)).toBe(false);
    }

    expect(tokens.spacing.section.lg).toBe(tokens.space[16]);
    expect(tokens.spacing.gutter.md).toBe(tokens.space[6]);
  });

  it("restringe o passo de 2px a micro spacing e não publica negativos", () => {
    expect(tokens.space["0_5"]).toBe("0.125rem");
    expect(Object.values(tokens.space).every((value) => dimensionToPixels(value) >= 0)).toBe(true);
    expect(tokenSource.component.statusBadge.size.xs.paddingBlock.$value).toBe("{space.0_5}");
  });

  it("faz o piloto de componentes consumir os papéis semânticos", () => {
    expect(tokens.component.tooltip.paddingBlock).toBe(tokens.spacing.default.inset.xs);
    expect(tokens.component.alert.gap).toBe(tokens.spacing.default.flow.inline.sm);
    expect(tokens.component.alert.featured.contentGap).toBe(tokens.spacing.default.flow.stack.md);
    expect(tokens.component.alert.featured.footerGap).toBe(tokens.spacing.default.flow.inline.sm);
    expect(tokens.component.statusBadge.size.sm.paddingInlineWithIcon).toBe(
      tokens.spacing.default.inset.sm,
    );
    expect(tokens.component.statusBadge.gap).toBe(tokens.spacing.default.flow.inline["2xs"]);

    expect(rootVariables.get("--clv-tooltip-padding-block")).toBe("var(--clv-spacing-inset-xs)");
    expect(rootVariables.get("--clv-alert-size-md-gap")).toBe("var(--clv-spacing-flow-inline-sm)");
    expect(rootVariables.get("--clv-alert-featured-content-gap")).toBe(
      "var(--clv-spacing-flow-stack-md)",
    );
    expect(rootVariables.get("--clv-status-badge-gap")).toBe("var(--clv-spacing-flow-inline-2xs)");
  });
});
