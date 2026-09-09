import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packagePath = resolve(process.cwd(), "package.json");
const stylesPath = resolve(process.cwd(), "src/styles.css");
const componentsPath = resolve(process.cwd(), "src/components");
const barrelPath = resolve(process.cwd(), "src/index.ts");

const HOOK_CALL = /\buse[A-Z][A-Za-z]*\s*\(/;
const CLIENT_DIRECTIVE = /^\s*(?:\/\*[\s\S]*?\*\/\s*)*["']use client["'];/;

function componentSources() {
  return readdirSync(componentsPath)
    .filter((name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"))
    .map((name) => ({ name, source: readFileSync(join(componentsPath, name), "utf8") }));
}

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

/**
 * Os dois consumidores — clavia-site e clavia-salesops — são Next App Router
 * com Server Components por padrão. Um componente com hook e sem a diretiva
 * quebra no build deles, não aqui: o Storybook roda tudo no cliente e nunca
 * exercita essa fronteira. Por isso a regra vive num teste, e não na revisão.
 */
describe("fronteira de client component", () => {
  it('todo componente com hook declara "use client"', () => {
    const faltando = componentSources()
      .filter(({ source }) => HOOK_CALL.test(source) && !CLIENT_DIRECTIVE.test(source))
      .map(({ name }) => name);

    expect(faltando).toEqual([]);
  });

  it('todo componente que usa react-aria declara "use client"', () => {
    const faltando = componentSources()
      .filter(
        ({ source }) => source.includes("react-aria-components") && !CLIENT_DIRECTIVE.test(source),
      )
      .map(({ name }) => name);

    expect(faltando).toEqual([]);
  });

  it('o barrel nunca declara "use client"', () => {
    // A diretiva aqui transformaria os 80 exports em client components para
    // todo consumidor, de uma vez — inclusive os que não têm estado nenhum.
    expect(CLIENT_DIRECTIVE.test(readFileSync(barrelPath, "utf8"))).toBe(false);
  });
});
