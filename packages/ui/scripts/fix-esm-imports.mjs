import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await visit(path);
    if (entry.name.endsWith(".js")) {
      const source = await readFile(path, "utf8");
      const output = source.replaceAll(/(from\s+["']\.{1,2}\/[^"]*?)(?<!\.js)(["'])/g, "$1.js$2");
      if (output !== source) await writeFile(path, output);
    }
  }
}

await visit("dist");
