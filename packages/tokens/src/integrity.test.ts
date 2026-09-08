import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";
import { tokens as runtimeTokens } from "./index";
import tokenSource from "./tokens.json";

type TokenLeaf = {
  $type: string;
  $value: unknown;
};

const cssSource = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

function isTokenLeaf(value: unknown): value is TokenLeaf {
  return Boolean(value && typeof value === "object" && "$value" in value);
}

function flattenTokens(tree: unknown, prefix: string[] = []) {
  const result = new Map<string, TokenLeaf>();

  if (!tree || typeof tree !== "object") return result;

  for (const [name, value] of Object.entries(tree)) {
    const path = [...prefix, name];

    if (isTokenLeaf(value)) {
      result.set(path.join("."), value);
    } else {
      for (const [key, token] of flattenTokens(value, path)) result.set(key, token);
    }
  }

  return result;
}

function flattenRuntimeTokens(tree: unknown, prefix: string[] = []) {
  const result = new Map<string, unknown>();

  if (!tree || typeof tree !== "object") return result;

  for (const [name, value] of Object.entries(tree)) {
    const path = [...prefix, name];

    if (value && typeof value === "object") {
      for (const [key, token] of flattenRuntimeTokens(value, path)) result.set(key, token);
    } else {
      result.set(path.join("."), value);
    }
  }

  return result;
}

function expectAcyclicGraph(graph: Map<string, string[]>, label: string) {
  const complete = new Set<string>();
  const active = new Set<string>();

  const visit = (node: string, trail: string[]) => {
    if (complete.has(node)) return;
    expect(active.has(node), `${label}: ciclo detectado em ${[...trail, node].join(" → ")}`).toBe(
      false,
    );
    active.add(node);

    for (const target of graph.get(node) ?? []) visit(target, [...trail, node]);

    active.delete(node);
    complete.add(node);
  };

  for (const node of graph.keys()) visit(node, []);
}

function cssVariables() {
  return new Map(
    [...cssSource.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1] as string,
      match[2]?.trim() ?? "",
    ]),
  );
}

describe("integridade global dos tokens", () => {
  it("mantém todos os aliases JSON resolvíveis e sem ciclos", () => {
    const tokens = flattenTokens(tokenSource);
    const graph = new Map<string, string[]>();

    expect(tokens.size).toBeGreaterThan(0);

    for (const [path, token] of tokens) {
      expect(token.$type, `${path} precisa declarar $type`).toBeTruthy();

      const targets =
        typeof token.$value === "string"
          ? [...token.$value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1] as string)
          : [];
      for (const target of targets) {
        expect(tokens.has(target), `${path} referencia o token inexistente ${target}`).toBe(true);
      }
      graph.set(path, targets);
    }

    expectAcyclicGraph(graph, "aliases JSON");
  });

  it("mantém aliases CSS resolvíveis e sem ciclos", () => {
    const variables = cssVariables();
    const graph = new Map<string, string[]>();

    expect(variables.size).toBeGreaterThan(0);

    for (const [name, value] of variables) {
      const targets = [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1] as string);
      for (const target of targets) {
        expect(
          variables.has(target),
          `${name} referencia a custom property inexistente ${target}`,
        ).toBe(true);
      }
      graph.set(name, targets);
    }

    expectAcyclicGraph(graph, "aliases CSS");
  });

  it("mantém paridade exata de caminhos entre TypeScript e JSON", () => {
    const jsonPaths = [...flattenTokens(tokenSource).keys()].sort();
    const runtimePaths = [...flattenRuntimeTokens(runtimeTokens).keys()].sort();

    expect(runtimePaths).toEqual(jsonPaths);
  });
});
