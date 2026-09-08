import { cp, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await cp("src/styles.css", "dist/styles.css");
await cp("src/assets", "dist/assets", { recursive: true });
