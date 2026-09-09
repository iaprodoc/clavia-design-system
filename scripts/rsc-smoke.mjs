/**
 * Prova a fronteira de client component com um build real de Next App Router.
 *
 * A regra em packages/ui/src/architecture.test.ts pega o caso óbvio — arquivo
 * com hook e sem a diretiva. Ela não pega provider de contexto atravessando a
 * fronteira, prop de função chegando num Server Component, nem o que o
 * bundler decide fazer com o barrel. Só um `next build` de verdade pega.
 *
 * Isto importa porque o Storybook roda tudo no cliente: a suíte inteira pode
 * ficar verde com a fronteira quebrada, e quem descobre é o build do
 * consumidor. Os dois consumidores (clavia-site, clavia-salesops) são App
 * Router com Server Components por padrão.
 *
 * A página da fixture é um Server Component que importa TODOS os exports do
 * barrel — importar é o que dispara o erro, mesmo sem renderizar.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = mkdtempSync(join(tmpdir(), "clavia-rsc-smoke-"));
const packages = ["tokens", "icons", "ui"];

function packageVersion(name) {
  return JSON.parse(readFileSync(join(repositoryRoot, "packages", name, "package.json"), "utf8"))
    .version;
}

function packPackage(name) {
  execFileSync("pnpm", ["pack", "--pack-destination", temporaryRoot], {
    cwd: join(repositoryRoot, "packages", name),
    stdio: "inherit",
  });

  const archive = readdirSync(temporaryRoot)
    .filter((entry) => entry.endsWith(".tgz"))
    .map((entry) => join(temporaryRoot, entry))
    .find((entry) => {
      const manifest = execFileSync("tar", ["-xOf", entry, "package/package.json"], {
        encoding: "utf8",
      });
      return JSON.parse(manifest).name === `@clavia-ds/${name}`;
    });

  if (!archive) throw new Error(`Tarball de @clavia-ds/${name} não encontrado.`);
  return archive;
}

/** Todos os nomes de valor exportados pelo barrel — tipos ficam de fora. */
function barrelExports() {
  const source = readFileSync(join(repositoryRoot, "packages/ui/src/index.ts"), "utf8");
  const names = new Set();

  for (const block of source.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const entry of block[1].split(",")) {
      const name = entry.trim();
      if (!name || name.startsWith("type ")) continue;
      names.add((name.split(/\s+as\s+/).pop() ?? name).trim());
    }
  }

  return [...names].sort();
}

const exports = barrelExports();
if (exports.length < 50) {
  throw new Error(`Só ${exports.length} exports lidos do barrel — o parser regrediu.`);
}

try {
  const archives = Object.fromEntries(packages.map((name) => [name, packPackage(name)]));
  const fixture = join(temporaryRoot, "next-app");
  mkdirSync(join(fixture, "app"), { recursive: true });

  writeFileSync(
    join(fixture, "package.json"),
    `${JSON.stringify(
      {
        dependencies: {
          "@clavia-ds/icons": `file:${archives.icons}`,
          "@clavia-ds/tokens": `file:${archives.tokens}`,
          "@clavia-ds/ui": `file:${archives.ui}`,
          next: "^16.3.0",
          react: "19.2.8",
          "react-dom": "19.2.8",
        },
        devDependencies: {
          // O next build aborta pedindo estes se a fixture tiver .tsx.
          "@types/node": "^22.15.3",
          "@types/react": "^19.2.0",
          typescript: "^5.9.3",
        },
        name: "clavia-rsc-smoke",
        pnpm: {
          overrides: {
            [`@clavia-ds/icons@${packageVersion("icons")}`]: `file:${archives.icons}`,
            [`@clavia-ds/tokens@${packageVersion("tokens")}`]: `file:${archives.tokens}`,
          },
        },
        private: true,
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(
    join(fixture, "next.config.mjs"),
    "export default { eslint: { ignoreDuringBuilds: true } };\n",
  );
  writeFileSync(
    join(fixture, "tsconfig.json"),
    `${JSON.stringify({ compilerOptions: { jsx: "preserve", module: "esnext", moduleResolution: "bundler", skipLibCheck: true, strict: true, target: "es2022" } }, null, 2)}\n`,
  );

  writeFileSync(
    join(fixture, "app/layout.tsx"),
    `import "@clavia-ds/tokens/css";
import "@clavia-ds/ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
`,
  );

  // Sem "use client": este arquivo é um Server Component de propósito.
  writeFileSync(
    join(fixture, "app/page.tsx"),
    `import { ${exports.join(", ")} } from "@clavia-ds/ui";

const barrel = [${exports.join(", ")}];

export default function Page() {
  return (
    <main>
      <p>{barrel.length} exports importados em um Server Component.</p>
      <Button variant="primary">Continuar</Button>
      <EmptyState title="Sem registros" description="Nenhum registro disponível." />
    </main>
  );
}
`,
  );

  execFileSync(
    "pnpm",
    ["install", "--prefer-offline", "--ignore-scripts", "--no-frozen-lockfile"],
    {
      cwd: fixture,
      stdio: "inherit",
    },
  );
  execFileSync("pnpm", ["exec", "next", "build"], {
    cwd: fixture,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: "inherit",
  });

  console.log(`rsc-smoke: ok — ${exports.length} exports importados em um Server Component.`);
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
