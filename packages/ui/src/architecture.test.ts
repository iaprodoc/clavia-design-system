import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packagePath = resolve(process.cwd(), "package.json");
const stylesPath = resolve(process.cwd(), "src/styles.css");

describe("contrato universal do pacote", () => {
  it("não exige HeroUI nem Tailwind em runtime", () => {
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8")) as {
      dependencies: Record<string, string>;
      peerDependencies: Record<string, string>;
    };

    expect(packageJson.peerDependencies.react).toBe(">=18 <20");
    expect(packageJson.peerDependencies["react-dom"]).toBe(">=18 <20");
    expect(packageJson.dependencies).not.toHaveProperty("@heroui/react");
    expect(packageJson.dependencies).not.toHaveProperty("tailwindcss");
  });

  it("publica CSS pronto, sem diretivas ou imports de framework", () => {
    const css = readFileSync(stylesPath, "utf8");

    expect(css).not.toMatch(/@import\s+["']@heroui/);
    expect(css).not.toMatch(/@tailwind|@theme|@apply/);
  });
});
