import { describe, expect, it } from "vitest";

import { tokens } from "./index";
import tokenSource from "./tokens.json";

function remToPixels(value: string) {
  return Number.parseFloat(value) * 16;
}

describe("contrato tipográfico", () => {
  it("mantém a escala primitiva equivalente entre TypeScript e JSON", () => {
    const jsonSizes = tokenSource.font.size;

    for (const [name, value] of Object.entries(tokens.font.size)) {
      const jsonValue = jsonSizes[name as keyof typeof jsonSizes].$value;

      expect(remToPixels(value)).toBe(Number.parseFloat(jsonValue));
    }
  });

  it("publica papéis semânticos completos sem criar famílias por produto", () => {
    expect(tokens.typography.heading.page.fontFamily).toBe(tokens.font.family.sans);
    expect(tokens.typography.body.default.fontFamily).toBe(tokens.font.family.sans);
    expect(tokens.typography.body.supporting.fontFamily).toBe(tokens.font.family.sans);
    expect(tokens.typography.code.fontFamily).toBe(tokens.font.family.mono);
    expect(tokenSource.typography.body.default.fontSize.$value).toBe("{font.size.md}");
    expect(tokenSource.typography.data.fontVariantNumeric.$value).toBe(
      "{font.variantNumeric.tabular}",
    );
  });

  it("reserva a adaptação responsiva ao título de página", () => {
    expect(tokens.typography.heading.page.fontSize.compact).toBe(tokens.font.size.xl);
    expect(tokens.typography.heading.page.fontSize.wide).toBe(tokens.font.size["2xl"]);
  });

  it("limita os papéis funcionais da Sora ao peso medium", () => {
    const publicSoraWeights = [
      tokens.typography.heading.page.fontWeight,
      tokens.typography.heading.section.fontWeight,
      tokens.typography.heading.component.fontWeight,
      tokens.typography.body.default.fontWeight,
      tokens.typography.body.supporting.fontWeight,
      tokens.typography.body.long.fontWeight,
      tokens.typography.label.default.fontWeight,
      tokens.typography.label.compact.fontWeight,
      tokens.typography.caption.fontWeight,
      tokens.typography.data.fontWeight,
    ];

    expect(Math.max(...publicSoraWeights)).toBe(tokens.font.weight.medium);
    expect(tokens.font.weight.semibold).toBe(600);
    expect("bold" in tokens.font.weight).toBe(false);
  });

  it("mantém texto público em pelo menos 12px e leitura contínua com entrelinha 1.5", () => {
    const publicSizes = [
      tokens.typography.heading.page.fontSize.compact,
      tokens.typography.heading.page.fontSize.wide,
      tokens.typography.heading.section.fontSize,
      tokens.typography.heading.component.fontSize,
      tokens.typography.body.default.fontSize,
      tokens.typography.body.supporting.fontSize,
      tokens.typography.body.long.fontSize,
      tokens.typography.label.default.fontSize,
      tokens.typography.label.compact.fontSize,
      tokens.typography.caption.fontSize,
      tokens.typography.data.fontSize,
      tokens.typography.code.fontSize,
    ];

    expect(Math.min(...publicSizes.map(remToPixels))).toBeGreaterThanOrEqual(12);
    expect(tokens.typography.body.default.lineHeight).toBeGreaterThanOrEqual(1.5);
    expect(tokens.typography.body.long.lineHeight).toBeGreaterThanOrEqual(1.5);
  });

  it("faz aliases internos consumirem papéis semânticos", () => {
    expect(tokens.component.button.fontWeight).toBe(tokens.typography.label.default.fontWeight);
    expect(tokens.component.field.labelFontWeight).toBe(tokens.typography.label.default.fontWeight);
    expect(tokens.component.textarea.fontSize).toBe(tokens.typography.body.supporting.fontSize);
    expect(tokens.component.textarea.fontWeight).toBe(tokens.typography.body.supporting.fontWeight);
    expect(tokens.component.tooltip.fontSize).toBe(tokens.typography.label.default.fontSize);
    expect(tokens.component.statusBadge.size.xs.fontSize).toBe(tokens.typography.caption.fontSize);
  });
});
