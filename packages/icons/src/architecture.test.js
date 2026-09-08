import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const guardedDirectories = [
  "packages/ui",
  "apps/storybook/src/components",
  "apps/storybook/src/compositions",
  "apps/storybook/src/foundations",
  "apps/storybook/src/brand",
];

const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const externalIconImportPattern =
  /(?:from\s*|import\s*\(|require\s*\()\s*["'](?:lucide-react|@phosphor-icons\/react(?:\/[^"']*)?)["']/;

function findWorkspaceRoot(startDirectory) {
  let directory = resolve(startDirectory);

  while (dirname(directory) !== directory) {
    if (existsSync(join(directory, "pnpm-workspace.yaml"))) {
      return directory;
    }

    directory = dirname(directory);
  }

  throw new Error("Raiz do workspace não encontrada.");
}

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === "node_modules" ? [] : collectSourceFiles(path);
    }

    const extension = entry.name.slice(entry.name.lastIndexOf("."));
    return sourceExtensions.has(extension) ? [path] : [];
  });
}

describe("governança de imports de ícones", () => {
  it("centraliza imports de bibliotecas externas em @clavia-ds/icons", () => {
    const workspaceRoot = findWorkspaceRoot(process.cwd());
    const violations = guardedDirectories.flatMap((directory) =>
      collectSourceFiles(join(workspaceRoot, directory))
        .filter((file) => externalIconImportPattern.test(readFileSync(file, "utf8")))
        .map((file) => relative(workspaceRoot, file)),
    );

    expect(violations, "Imports diretos de bibliotecas externas de ícones encontrados").toEqual([]);
  });

  it("remove Lucide da implementação do catálogo público", () => {
    const workspaceRoot = findWorkspaceRoot(process.cwd());
    const publicCatalog = readFileSync(join(workspaceRoot, "packages/icons/src/index.tsx"), "utf8");

    expect(publicCatalog).not.toContain("lucide-react");
  });
});
