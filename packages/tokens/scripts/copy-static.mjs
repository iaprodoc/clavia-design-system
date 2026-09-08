import { cp, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await cp("src/tokens.css", "dist/tokens.css");
await cp("src/tokens.json", "dist/tokens.json");
