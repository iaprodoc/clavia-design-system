import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const repositoryRoot = new URL("../../../", import.meta.url);
const tokenSourcePath = new URL("packages/tokens/src/tokens.css", repositoryRoot);
const cssRoots = [
  new URL("apps/storybook/src/", repositoryRoot),
  new URL("packages/ui/src/", repositoryRoot),
];

const knownInvalidNames = new Set([
  "--clv-border-radius-md",
  "--clv-border-width-default",
  "--clv-color-feedback-danger-text",
  "--clv-color-feedback-success-text",
  "--clv-color-surface-default",
  "--clv-color-text-default",
  "--clv-color-text-subtle",
  "--clv-layout-gutter-default",
  "--clv-radius-full",
  "--clv-shadow-md",
]);

const runtimeAllowlist = [
  {
    css: "apps/storybook/src/foundations/border.css",
    name: "--clv-border-sample-width",
    rationale: "Amostra recebe a largura selecionada pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Border.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/border.css",
    name: "--clv-border-sample-style",
    rationale: "Amostra recebe o estilo selecionado pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Border.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/effects.css",
    name: "--clv-effects-sample",
    rationale: "Amostra recebe o efeito selecionado pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Effects.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/elevation.css",
    name: "--clv-elevation-sample",
    rationale: "Amostra recebe a elevação selecionada pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Elevation.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/layout.css",
    name: "--clv-layout-sample",
    rationale: "Amostra recebe a medida selecionada pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Layout.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/radius.css",
    name: "--clv-radius-sample",
    rationale: "Amostra recebe o raio selecionado pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Radius.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/spacing.css",
    name: "--clv-spacing-sample-size",
    rationale: "Amostra recebe a dimensão selecionada pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Spacing.stories.tsx",
  },
  {
    css: "apps/storybook/src/foundations/spacing.css",
    name: "--clv-spacing-sample-gap",
    rationale: "Amostra recebe o gap selecionado pela matriz de foundation.",
    source: "apps/storybook/src/foundations/Spacing.stories.tsx",
  },
] as const;

function listCssFiles(directory: URL): URL[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = new URL(entry.isDirectory() ? `${entry.name}/` : entry.name, directory);
    if (entry.isDirectory()) return listCssFiles(target);
    return entry.isFile() && entry.name.endsWith(".css") ? [target] : [];
  });
}

function relative(file: URL) {
  return decodeURIComponent(file.pathname.slice(repositoryRoot.pathname.length));
}

function lineNumber(source: string, offset: number) {
  return source.slice(0, offset).split("\n").length;
}

const tokenSource = readFileSync(tokenSourcePath, "utf8");
const publishedTokens = new Set(
  [...tokenSource.matchAll(/(--clv-[\w-]+)\s*:/g)].map((match) => match[1] as string),
);
const cssFiles = cssRoots.flatMap(listCssFiles).sort();
const allowlistKeys = new Set(runtimeAllowlist.map(({ css, name }) => `${css}:${name}`));

describe("integridade das custom properties públicas", () => {
  it("não reintroduz nomes inválidos conhecidos", () => {
    const violations = cssFiles.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return [...source.matchAll(/var\(\s*(--clv-[\w-]+)/g)]
        .filter((match) => knownInvalidNames.has(match[1] as string))
        .map((match) => `${relative(file)}:${lineNumber(source, match.index)} ${match[1]}`);
    });

    expect(violations).toEqual([]);
  });

  it("resolve referências do CSS de UI e de todo o Storybook", () => {
    const unresolved = cssFiles.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      const localDeclarations = new Set(
        [...source.matchAll(/(--clv-[\w-]+)\s*:/g)].map((match) => match[1] as string),
      );

      return [...source.matchAll(/var\(\s*(--clv-[\w-]+)/g)]
        .filter((match) => {
          const name = match[1] as string;
          return (
            !publishedTokens.has(name) &&
            !localDeclarations.has(name) &&
            !allowlistKeys.has(`${relative(file)}:${name}`)
          );
        })
        .map((match) => `${relative(file)}:${lineNumber(source, match.index)} ${match[1]}`);
    });

    expect(unresolved).toEqual([]);
  });

  it("mantém a allowlist mínima vinculada a declarações de runtime", () => {
    for (const entry of runtimeAllowlist) {
      const cssSource = readFileSync(new URL(entry.css, repositoryRoot), "utf8");
      const runtimeSource = readFileSync(new URL(entry.source, repositoryRoot), "utf8");

      expect(entry.rationale.length).toBeGreaterThan(20);
      expect(cssSource).toContain(`var(${entry.name}`);
      expect(runtimeSource).toContain(`"${entry.name}"`);
      expect(publishedTokens.has(entry.name)).toBe(false);
    }
  });
});
