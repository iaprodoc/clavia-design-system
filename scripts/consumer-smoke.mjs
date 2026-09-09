import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = mkdtempSync(join(tmpdir(), "clavia-consumer-smoke-"));
const packages = ["tokens", "icons", "ui"];

/**
 * A versão é lida do manifesto, nunca fixada. Os overrides do pnpm casam por
 * `nome@versão`: com a versão escrita à mão, o primeiro `changeset version`
 * faria a chave parar de casar, o pnpm buscaria o pacote no registro e o
 * smoke test quebraria exatamente no release em que ele mais importa.
 */
function packageVersion(packageName) {
  const manifest = join(repositoryRoot, "packages", packageName, "package.json");
  return JSON.parse(readFileSync(manifest, "utf8")).version;
}

function packPackage(packageName) {
  const packageDirectory = join(repositoryRoot, "packages", packageName);
  execFileSync("pnpm", ["pack", "--pack-destination", temporaryRoot], {
    cwd: packageDirectory,
    stdio: "inherit",
  });

  const archive = readdirSync(temporaryRoot)
    .filter((entry) => entry.endsWith(".tgz"))
    .map((entry) => join(temporaryRoot, entry))
    .find((entry) => {
      const manifest = execFileSync("tar", ["-xOf", entry, "package/package.json"], {
        encoding: "utf8",
      });
      return JSON.parse(manifest).name === `@clavia-ds/${packageName}`;
    });

  if (!archive) throw new Error(`Tarball de @clavia-ds/${packageName} não encontrado.`);
  return archive;
}

const smokeSource = `
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CheckIcon } from "@clavia-ds/icons";
import { Button, EmptyState } from "@clavia-ds/ui";
import { tokens } from "@clavia-ds/tokens";

const expectedReact = process.env.CLAVIA_EXPECTED_REACT;
if (React.version !== expectedReact) {
  throw new Error(\`React carregado: \${React.version}; esperado: \${expectedReact}.\`);
}

const markup = renderToStaticMarkup(
  createElement("main", null,
    createElement(Button, { leadingIcon: createElement(CheckIcon), variant: "primary" }, "Continuar"),
    createElement(EmptyState, { description: "Nenhum registro disponível.", title: "Sem registros" }),
  ),
);
if (!markup.includes("Continuar") || !markup.includes("Sem registros")) {
  throw new Error("Os componentes do tarball não renderizaram o conteúdo esperado.");
}
if (!tokens.component?.button?.paddingBlock || !tokens.component?.statusBadge?.size?.md?.lineHeight) {
  throw new Error("Os caminhos canônicos de tokens não estão disponíveis no runtime.");
}

const tokensCss = readFileSync(fileURLToPath(import.meta.resolve("@clavia-ds/tokens/css")), "utf8");
const uiCssPath = fileURLToPath(import.meta.resolve("@clavia-ds/ui/styles.css"));
const uiCss = readFileSync(uiCssPath, "utf8");
if (!tokensCss.includes("--clv-color-text-primary") || !uiCss.includes("--clv-button")) {
  throw new Error("Os CSS públicos dos tarballs estão incompletos.");
}

for (const asset of [
  "checkbox-check-lg.svg",
  "checkbox-check-md.svg",
  "checkbox-indeterminate-lg.svg",
  "checkbox-indeterminate-md.svg",
  "img_empty_state2.webp",
]) {
  if (!existsSync(join(dirname(uiCssPath), "assets", asset))) {
    throw new Error(\`Asset público ausente no pacote UI: \${asset}.\`);
  }
}

console.log(JSON.stringify({ markupLength: markup.length, react: React.version }));
`;

try {
  const archives = Object.fromEntries(packages.map((name) => [name, packPackage(name)]));

  for (const reactVersion of ["18.3.1", "19.2.8"]) {
    const fixtureDirectory = join(temporaryRoot, `react-${reactVersion}`);
    mkdirSync(fixtureDirectory);
    writeFileSync(
      join(fixtureDirectory, "package.json"),
      `${JSON.stringify(
        {
          dependencies: {
            "@clavia-ds/icons": `file:${archives.icons}`,
            "@clavia-ds/tokens": `file:${archives.tokens}`,
            "@clavia-ds/ui": `file:${archives.ui}`,
            react: reactVersion,
            "react-dom": reactVersion,
          },
          pnpm: {
            overrides: {
              [`@clavia-ds/icons@${packageVersion("icons")}`]: `file:${archives.icons}`,
              [`@clavia-ds/tokens@${packageVersion("tokens")}`]: `file:${archives.tokens}`,
            },
          },
          private: true,
          type: "module",
        },
        null,
        2,
      )}\n`,
    );
    writeFileSync(join(fixtureDirectory, "smoke.mjs"), smokeSource);
    execFileSync(
      "pnpm",
      ["install", "--prefer-offline", "--ignore-scripts", "--no-frozen-lockfile"],
      {
        cwd: fixtureDirectory,
        stdio: "inherit",
      },
    );
    execFileSync("node", ["smoke.mjs"], {
      cwd: fixtureDirectory,
      env: { ...process.env, CLAVIA_EXPECTED_REACT: reactVersion },
      stdio: "inherit",
    });
  }
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
