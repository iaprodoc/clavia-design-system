import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

function archiveFile(archivePath, filename) {
  return execFileSync("tar", ["-xOf", archivePath, `package/${filename}`], {
    encoding: "utf8",
  });
}

function archiveBuffer(archivePath, filename) {
  return execFileSync("tar", ["-xOf", archivePath, `package/${filename}`]);
}

function definitions(...sources) {
  return new Set(
    sources.flatMap((source) =>
      [...source.matchAll(/(--clv-[\w-]+)\s*:/g)].map((match) => match[1]),
    ),
  );
}

function undefinedReferences(source, knownDefinitions) {
  return [
    ...new Set(
      [...source.matchAll(/var\(\s*(--clv-[\w-]+)/g)]
        .map((match) => match[1])
        .filter((reference) => !knownDefinitions.has(reference)),
    ),
  ].sort();
}

function expectExactArtifact(archivePath, filename, localPath) {
  const packed = archiveFile(archivePath, filename);
  const local = readFileSync(localPath, "utf8");

  if (packed !== local) {
    throw new Error(`${filename} do tarball diverge do artefato local em ${localPath}.`);
  }

  return packed;
}

function expectSourceParity(sourcePath, artifactPath) {
  if (readFileSync(sourcePath, "utf8") !== readFileSync(artifactPath, "utf8")) {
    throw new Error(`${artifactPath} diverge do fonte ${sourcePath}.`);
  }
}

function relativeFiles(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    return entry.isDirectory()
      ? relativeFiles(join(directory, entry.name), relativePath)
      : [relativePath];
  });
}

const destination = mkdtempSync(join(tmpdir(), "clavia-pack-check-"));

try {
  execFileSync("pnpm", ["pack", "--pack-destination", destination], {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  const archive = readdirSync(destination).find((entry) => entry.endsWith(".tgz"));

  if (!archive) {
    throw new Error("O pnpm pack não produziu um tarball.");
  }

  const archivePath = join(destination, archive);
  const archiveEntries = execFileSync("tar", ["-tf", archivePath], { encoding: "utf8" }).split(
    "\n",
  );
  const manifest = JSON.parse(archiveFile(archivePath, "package.json"));
  const workspaceDependencies = Object.entries({
    ...manifest.dependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  }).filter(([, version]) => typeof version === "string" && version.startsWith("workspace:"));

  if (workspaceDependencies.length > 0) {
    throw new Error(
      `${basename(archive)} contém dependências workspace não publicáveis: ${workspaceDependencies
        .map(([name]) => name)
        .join(", ")}.`,
    );
  }

  if (archiveEntries.some((entry) => entry.startsWith("package/dist/test/"))) {
    throw new Error(`${basename(archive)} contém artefatos internos em dist/test/.`);
  }

  if (manifest.name === "@clavia-ds/tokens") {
    expectSourceParity(
      resolve(process.cwd(), "src/tokens.css"),
      resolve(process.cwd(), "dist/tokens.css"),
    );
    const packedTokens = expectExactArtifact(
      archivePath,
      "dist/tokens.css",
      resolve(process.cwd(), "dist/tokens.css"),
    );
    const unresolved = undefinedReferences(packedTokens, definitions(packedTokens));

    if (unresolved.length > 0) {
      throw new Error(
        `tokens.css do tarball contém referências inválidas: ${unresolved.join(", ")}.`,
      );
    }
  }

  if (manifest.name === "@clavia-ds/ui") {
    expectSourceParity(
      resolve(process.cwd(), "src/styles.css"),
      resolve(process.cwd(), "dist/styles.css"),
    );
    const packedUi = expectExactArtifact(
      archivePath,
      "dist/styles.css",
      resolve(process.cwd(), "dist/styles.css"),
    );
    const packedTokens = readFileSync(resolve(process.cwd(), "../tokens/dist/tokens.css"), "utf8");
    const unresolved = undefinedReferences(packedUi, definitions(packedTokens, packedUi));

    if (unresolved.length > 0) {
      throw new Error(
        `styles.css do tarball contém referências inválidas: ${unresolved.join(", ")}.`,
      );
    }

    const assetsDirectory = resolve(process.cwd(), "src/assets");
    for (const asset of relativeFiles(assetsDirectory)) {
      const local = readFileSync(join(assetsDirectory, asset));
      const packed = archiveBuffer(archivePath, `dist/assets/${asset}`);

      if (!packed.equals(local)) {
        throw new Error(`dist/assets/${asset} do tarball diverge do asset-fonte.`);
      }
    }
  }
} finally {
  rmSync(destination, { force: true, recursive: true });
}
