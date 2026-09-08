declare module "node:fs" {
  interface Dirent {
    isDirectory(): boolean;
    isFile(): boolean;
    name: string;
  }

  export function readdirSync(path: URL, options: { withFileTypes: true }): Dirent[];
  export function readFileSync(path: URL, encoding: "utf8"): string;
}
