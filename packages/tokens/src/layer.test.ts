import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { tokens } from "./index";
import tokenSource from "./tokens.json";

const cssSource = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

describe("contrato de camadas", () => {
  it("mantém a camada modal equivalente em TypeScript, JSON e CSS", () => {
    const cssValue = cssSource.match(/--clv-layer-modal:\s*([^;]+);/)?.[1]?.trim();

    expect(tokens.layer.modal).toBe(50);
    expect(tokenSource.layer.modal).toEqual({ $type: "number", $value: 50 });
    expect(Number(cssValue)).toBe(50);
  });

  it("reserva a camada a raízes fixed sem criar aliases z-index legados", () => {
    expect(cssSource).not.toContain("--clv-z-index-modal");
    expect(cssSource).toContain("Camada reservada a raízes fixed de modais");
  });
});
