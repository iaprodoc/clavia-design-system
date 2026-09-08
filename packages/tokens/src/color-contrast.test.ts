import { describe, expect, it } from "vitest";

import { tokens } from "./index";

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map(
    (position) => Number.parseInt(hex.slice(position, position + 2), 16) / 255,
  );
  const [red = 0, green = 0, blue = 0] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

describe("tokens de movimento", () => {
  it("publica uma duração curta para entradas de contexto", () => {
    expect(tokens.motion.duration.enter).toBe("240ms");
    expect(tokens.motion.easing).toBe("cubic-bezier(0.2, 0, 0, 1)");
  });
});

describe("tokens de cor", () => {
  it("mantém escalas primitivas únicas e ordenadas do claro ao escuro", () => {
    const scales = [
      tokens.color.primitive.gray,
      tokens.color.primitive.blue,
      tokens.color.primitive.info,
      tokens.color.primitive.green,
      tokens.color.primitive.amber,
      tokens.color.primitive.red,
    ] as const;

    for (const scale of scales) {
      const values = Object.values(scale);

      expect(new Set(values).size).toBe(12);

      for (let index = 1; index < values.length; index += 1) {
        const previous = values[index - 1];
        const current = values[index];

        expect(previous).toBeDefined();
        expect(current).toBeDefined();
        expect(relativeLuminance(current ?? "#000000")).toBeLessThan(
          relativeLuminance(previous ?? "#FFFFFF"),
        );
      }
    }
  });

  it("preserva as âncoras da marca nos papéis corretos", () => {
    expect(tokens.color.accent.default).toBe("#021826");
    expect(tokens.color.accent.secondary).toBe("#56B2ED");
    expect(tokens.color.accent.secondaryHover).toBe("#7EA5C2");
    expect(tokens.color.accent.secondaryActive).toBe("#5D8CAB");
    expect(tokens.color.action.primary).toBe("#224E82");
    expect(tokens.color.surface.chrome).toBe("#F4F8FC");
    expect(tokens.color.text.primary).toBe("#021826");
    expect(tokens.color.surface.brandRail).toBe("#A1C6F2");
    expect(tokens.color.surface.sunken).toBe("#EFEEED");
  });

  it("reserva o acento secundário para realces sobre superfícies escuras", () => {
    expect(
      contrastRatio(tokens.color.accent.secondary, tokens.color.surface.brand),
    ).toBeGreaterThanOrEqual(3);
  });

  it("separa canvas, superfície sutil e plano rebaixado", () => {
    expect(relativeLuminance(tokens.color.surface.canvas)).toBeGreaterThan(
      relativeLuminance(tokens.color.surface.subtle),
    );
    expect(relativeLuminance(tokens.color.surface.subtle)).toBeGreaterThan(
      relativeLuminance(tokens.color.surface.sunken),
    );
  });

  it("mantém contraste AA nas combinações de texto e status publicadas", () => {
    const pairs = [
      [tokens.color.text.primary, tokens.color.surface.canvas],
      [tokens.color.text.secondary, tokens.color.surface.canvas],
      [tokens.color.text.muted, tokens.color.surface.raised],
      [tokens.component.button.glass.text, tokens.component.button.glass.background],
      [tokens.color.action.primary, tokens.color.surface.raised],
      [tokens.color.text.inverse, tokens.color.action.primary],
      [tokens.color.text.inverse, tokens.color.accent.default],
      [tokens.color.text.primary, tokens.color.accent.secondary],
      [tokens.color.text.primary, tokens.color.accent.secondaryHover],
      [tokens.color.text.primary, tokens.color.accent.secondaryActive],
      [tokens.component.button.primary.textHover, tokens.component.button.primary.backgroundHover],
      [
        tokens.component.button.primary.textActive,
        tokens.component.button.primary.backgroundActive,
      ],
      [tokens.component.button.surface.text, tokens.component.button.surface.background],
      [tokens.color.text.inverse, tokens.color.accent.hover],
      [tokens.color.text.inverse, tokens.color.accent.active],
      [tokens.color.text.inverse, tokens.color.primitive.blue[9]],
      [tokens.color.text.inverse, tokens.color.text.primary],
      [tokens.color.text.onBrand, tokens.color.surface.brand],
      [tokens.color.text.onBrandMuted, tokens.color.surface.brand],
      [tokens.color.status.neutral, tokens.color.status.neutralSubtle],
      [tokens.color.status.success, tokens.color.status.successSubtle],
      [tokens.color.status.warning, tokens.color.status.warningSubtle],
      [tokens.color.status.danger, tokens.color.status.dangerSubtle],
      [tokens.color.status.info, tokens.color.status.infoSubtle],
      [
        tokens.component.statusBadge.neutral.solid.text,
        tokens.component.statusBadge.neutral.solid.background,
      ],
      [
        tokens.component.statusBadge.success.solid.text,
        tokens.component.statusBadge.success.solid.background,
      ],
      [
        tokens.component.statusBadge.warning.solid.text,
        tokens.component.statusBadge.warning.solid.background,
      ],
      [
        tokens.component.statusBadge.danger.solid.text,
        tokens.component.statusBadge.danger.solid.background,
      ],
      [
        tokens.component.statusBadge.info.solid.text,
        tokens.component.statusBadge.info.solid.background,
      ],
      [
        tokens.component.statusBadge.neutral.soft.text,
        tokens.component.statusBadge.neutral.soft.background,
      ],
      [
        tokens.component.statusBadge.success.soft.text,
        tokens.component.statusBadge.success.soft.background,
      ],
      [
        tokens.component.statusBadge.warning.soft.text,
        tokens.component.statusBadge.warning.soft.background,
      ],
      [
        tokens.component.statusBadge.danger.soft.text,
        tokens.component.statusBadge.danger.soft.background,
      ],
      [
        tokens.component.statusBadge.info.soft.text,
        tokens.component.statusBadge.info.soft.background,
      ],
    ] as const;

    for (const [foreground, background] of pairs) {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("mantém o contorno forte de controles perceptível sobre branco", () => {
    expect(
      contrastRatio(tokens.color.border.strong, tokens.color.surface.raised),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(tokens.color.focus.outline, tokens.color.surface.raised),
    ).toBeGreaterThanOrEqual(3);
  });

  it("impede texto branco no acento claro de seleção", () => {
    expect(contrastRatio(tokens.color.text.inverse, tokens.color.accent.secondary)).toBeLessThan(
      4.5,
    );
    expect(
      contrastRatio(tokens.color.text.primary, tokens.color.accent.secondary),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

describe("tokens de tipografia", () => {
  it("publica Sora como família funcional", () => {
    expect(tokens.font.family.sans).toContain('"Sora Variable"');
    expect(tokens.font.family.sans).toContain("Arial");
  });

  it("limita os pesos publicados a semibold (600)", () => {
    expect(tokens.font.weight.light).toBe(300);
    expect(Math.max(...Object.values(tokens.font.weight))).toBe(600);
  });

  it("publica entrelinha para títulos, corpo e texto de apoio", () => {
    expect(tokens.font.lineHeight.tight).toBeLessThan(tokens.font.lineHeight.default);
    expect(tokens.font.lineHeight.relaxed).toBeGreaterThan(tokens.font.lineHeight.default);
  });
});

describe("tokens de forma e profundidade", () => {
  it("publica o desfoque expressivo da marca", () => {
    expect(tokens.effect.blur.brandMedia).toBe("2rem");
    expect(tokens.effect.blur.brand).toBe(tokens.effect.blur.brandMedia);
  });

  it("publica o raio xl usado por cartões de página", () => {
    expect(tokens.radius.xl).toBe("1.5rem");
  });

  it("centraliza elevação reutilizável", () => {
    expect(tokens.elevation.raised).toContain("rgb(2 24 38");
    expect(tokens.elevation.interactive).toContain("rgb(34 78 130 / 10%)");
    expect(tokens.elevation.interactive).toContain("rgb(7 88 140 / 10%)");
    expect(tokens.component.textarea.shadow).toBe(tokens.elevation.raised);
    expect(tokens.component.select.popover.shadow).toBe(tokens.elevation.floating);
  });

  it("alinha o StepCard ao arredondamento de superfície", () => {
    expect(tokens.component.stepCard.indicatorRadius).toBe(tokens.shape.surface);
    expect(tokens.component.stepCard.radius).toBe(tokens.shape.surface);
  });
});

describe("tokens de gradiente", () => {
  it("publica alternativas para superfícies claras e escuras", () => {
    expect(tokens.gradient.surface.action).toContain("141deg");
    expect(tokens.gradient.surface.action).toContain(tokens.color.primitive.blue[9]);
    expect(tokens.gradient.surface.action).toContain(tokens.color.surface.brand);
    expect(tokens.color.surface.brandTranslucent).toBe("rgb(2 24 38 / 64%)");
    expect(tokens.effect.blur.brandSurface).toBe("0.125rem");
    expect(tokens.gradient.text.onLight).toContain("linear-gradient");
    expect(tokens.gradient.text.onDark).toContain("linear-gradient");
  });
});

describe("tokens de componente", () => {
  it("publica o acabamento interativo do botão gradiente", () => {
    expect(tokens.component.button.gradient.background).toBe(tokens.gradient.surface.action);
    expect(tokens.component.button.gradient.backgroundHover).toContain("rgb(255 255 255 / 10%)");
    expect(tokens.component.button.gradient.backgroundActive).toContain("rgb(2 24 38 / 12%)");
    expect(tokens.component.button.gradient.shadow).toContain("inset");
    expect(tokens.component.button.gradient.text).toBe(tokens.color.text.inverse);
  });

  it("mapeia o alerta para os aliases semânticos de status e elevação", () => {
    expect(tokens.component.alert.featured.background).toBe(tokens.color.surface.raised);
    expect(tokens.component.alert.featured.border).toBe(tokens.color.status.neutralSurface);
    expect(tokens.component.alert.featured.divider).toBe(tokens.color.border.subtle);
    expect(tokens.component.alert.featured.auraBlur).toBe(tokens.effect.blur.brandMedia);
    expect(tokens.component.alert.featured.shadow).toBe(tokens.elevation.lifted);
    expect(tokens.component.alert.shadow).toBe(tokens.elevation.raised);
    expect(tokens.component.alert.radius).toBe(tokens.shape.surface);
    expect(tokens.component.alert.gap).toBe(tokens.space[3]);
    expect(tokens.component.alert.iconSize).toBe(tokens.space[5]);
    expect(tokens.component.alert.info.text).toBe(tokens.color.status.infoStrong);
    expect(tokens.component.alert.success.text).toBe(tokens.color.status.success);
    expect(tokens.component.alert.success.aura).toBe(tokens.color.status.successSurface);
    expect(tokens.component.alert.warning.text).toBe(tokens.color.status.warning);
    expect(tokens.component.alert.danger.text).toBe(tokens.color.status.danger);
  });

  it("mapeia os componentes estáveis para aliases semânticos", () => {
    expect(tokens.component.button.minHeight).toBe(tokens.component.button.size.md.minHeight);
    expect(tokens.component.button.padding.block).toBe(tokens.space[3]);
    expect(tokens.component.button.padding.inline).toBe(tokens.space[8]);
    expect(tokens.component.button.paddingBlock).toBe(tokens.space[3]);
    expect(tokens.component.button.paddingInline).toBe(tokens.space[8]);
    expect(tokens.component.button.radius).toBe(tokens.radius.pill);
    expect(tokens.component.button.fontWeight).toBe(tokens.typography.label.default.fontWeight);
    expect(tokens.component.button.gap).toBe(tokens.space[1]);
    expect(tokens.component.button.shadow).toBe(tokens.elevation.raised);
    expect(tokens.component.button.focusRing).toContain("0 0 0 4px");
    expect(tokens.component.button.size.sm.minHeight).toBe("2.75rem");
    expect(tokens.component.button.size.md.minHeight).toBe("3.25rem");
    expect(tokens.component.button.size.lg.minHeight).toBe("3.75rem");
    expect(tokens.component.button.size.sm.paddingInline).toBe(tokens.space[6]);
    expect(tokens.component.button.size.md.paddingInline).toBe(tokens.space[8]);
    expect(tokens.component.button.size.lg.paddingInline).toBe(tokens.space[10]);
    expect(tokens.component.button.size.sm.paddingBlock).toBe(tokens.space[2]);
    expect(tokens.component.button.size.md.paddingBlock).toBe(tokens.space[3]);
    expect(tokens.component.button.size.lg.paddingBlock).toBe(tokens.space[4]);
    expect(tokens.component.button.size.sm.paddingInlineEndWithTrailingIcon).toBe(tokens.space[4]);
    expect(tokens.component.button.size.md.paddingInlineEndWithTrailingIcon).toBe(tokens.space[6]);
    expect(tokens.component.button.size.lg.paddingInlineEndWithTrailingIcon).toBe(tokens.space[8]);
    expect(tokens.component.button.size.sm.radius).toBe(tokens.radius.pill);
    expect(tokens.component.button.size.md.radius).toBe(tokens.component.button.radius);
    expect(tokens.component.button.size.lg.radius).toBe(tokens.component.button.radius);
    expect(tokens.component.button.size.sm.iconSize).toBe(tokens.space[5]);
    expect(tokens.component.button.size.md.iconSize).toBe(tokens.space[6]);
    expect(tokens.component.button.gradient.background).toContain("linear-gradient");
    expect(tokens.component.button.gradient.text).toBe(tokens.color.text.inverse);
    expect(tokens.component.button.glass.background).toBe(tokens.color.action.secondary);
    expect(tokens.component.button.glass.backdropBlur).toBe("0.25rem");
    expect(tokens.component.button.glass.radius).toBe(tokens.component.button.radius);
    expect(tokens.component.button.glass.text).toBe(tokens.color.text.primary);
    expect(tokens.component.button.glass.border).toBe(tokens.color.border.brandSurface);
    expect(tokens.component.button.glass.textDisabled).toBe(tokens.color.text.muted);
    expect(tokens.component.button.primary.background).toBe(tokens.color.action.primary);
    expect(tokens.component.button.primary.backgroundHover).toBe(tokens.color.accent.hover);
    expect(tokens.component.button.primary.backgroundActive).toBe(tokens.color.accent.default);
    expect(tokens.component.button.primary.text).toBe(tokens.color.text.inverse);
    expect(tokens.component.button.primary.textHover).toBe(tokens.color.text.onBrandMuted);
    expect(tokens.component.button.primary.textActive).toBe(tokens.color.text.inverse);
    expect(tokens.component.button.secondary.background).toBe(tokens.color.surface.subtle);
    expect(tokens.component.button.secondary.backgroundHover).toBe(
      tokens.color.action.primarySubtle,
    );
    expect(tokens.component.button.secondary.backgroundActive).toBe(tokens.color.surface.sunken);
    expect(tokens.component.button.secondary.border).toBe(tokens.color.border.subtle);
    expect(tokens.component.button.tertiary.background).toBe(tokens.color.action.secondary);
    expect(tokens.component.button.tertiary.backgroundHover).toBe(
      tokens.color.action.secondaryHover,
    );
    expect(tokens.component.button.surface.background).toBe(tokens.color.surface.subtle);
    expect(tokens.component.button.surface.backgroundHover).toBe(tokens.color.action.primarySubtle);
    expect(tokens.component.button.surface.backgroundActive).toBe(tokens.color.surface.sunken);
    expect(tokens.component.button.surface.border).toBe(tokens.color.border.subtle);
    expect(tokens.component.button.surface.text).toBe(tokens.color.text.secondary);
    expect(tokens.component.button.danger.background).toBe(tokens.color.status.danger);
    expect(tokens.component.checkbox.control.backgroundChecked).toBe(tokens.color.accent.secondary);
    expect(tokens.component.checkbox.control.backgroundCheckedHover).toBe(
      tokens.color.accent.secondaryHover,
    );
    expect(tokens.component.checkbox.control.mark).toBe(tokens.color.text.primary);
    expect(tokens.component.checkbox.control.backgroundHover).toBe(tokens.color.surface.subtle);
    expect(tokens.component.checkbox.control.backgroundDisabledChecked).toBe(
      tokens.color.action.secondary,
    );
    expect(tokens.component.checkbox.control.border).toBe(tokens.color.border.subtle);
    expect(tokens.component.checkbox.control.borderHover).toBe(tokens.color.border.subtle);
    expect(tokens.component.checkbox.control.borderFocus).toBe(tokens.color.border.focus);
    expect(tokens.component.checkbox.control.borderError).toBe(tokens.color.status.danger);
    expect(tokens.component.field.control.borderError).toBe(tokens.color.status.danger);
    expect(tokens.component.field.control.icon).toBe(tokens.color.action.primary);
    expect(tokens.component.field.labelFontWeight).toBe(tokens.font.weight.medium);
    expect(tokens.component.radio.control.borderChecked).toBe(tokens.color.accent.secondary);
    expect(tokens.component.radio.control.borderError).toBe(tokens.color.status.danger);
    expect(tokens.component.radio.control.dot).toBe(tokens.color.accent.secondary);
    expect(tokens.component.radio.control.size).toBe("1.25rem");
    expect(tokens.component.logo.color.primary).toBe(tokens.color.accent.default);
    expect(tokens.component.logo.color.secondary).toBe(tokens.color.action.primary);
    expect(tokens.component.logo.color.support).toBe(tokens.color.surface.sunken);
    expect(tokens.component.logo.color.inverse).toBe(tokens.color.text.inverse);
    expect(tokens.component.pageHeader.eyebrow.text).toBe(tokens.color.action.primary);
    expect(tokens.component.pageHeader.shadow).toBe(tokens.elevation.flat);
    expect(tokens.component.saveStatus.radar.duration).toBe(tokens.motion.cycle.ambient);
    expect(tokens.component.saveStatus.radar.opacity).toBe(0.4);
    expect(tokens.component.saveStatus.radar.scale).toBe(3);
    expect(tokens.component.progress.indicator).toBe(tokens.color.accent.secondary);
    expect(tokens.component.slider.accent).toBe(tokens.color.accent.secondary);
    expect(tokens.component.slider.thumb.background).toBe(tokens.color.action.primary);
    expect(tokens.component.slider.thumb.backgroundHover).toBe(tokens.color.action.primaryHover);
    expect(tokens.component.button.adaptiveGlass.backdropBlur).toBe(
      tokens.component.stickyActionBar.backdropBlur,
    );
    expect(tokens.component.button.adaptiveGlass.background).toBe(
      tokens.component.stickyActionBar.background,
    );
    expect(tokens.component.button.adaptiveGlass.border).toBe(
      tokens.component.stickyActionBar.border,
    );
    expect(tokens.component.button.adaptiveGlass.highlight).toBe(
      tokens.component.stickyActionBar.highlight,
    );
    expect(tokens.component.button.adaptiveGlass.outline).toBe(
      tokens.component.stickyActionBar.outline,
    );
    expect(tokens.component.button.adaptiveGlass.shadow).toBe("none");
    expect(tokens.component.button.adaptiveGlass.sheen).toBe(
      tokens.component.stickyActionBar.sheen,
    );
    expect(tokens.component.button.adaptiveGlass.onDark.border).toBe(
      tokens.component.stickyActionBar.onDark.surface.border,
    );
    expect(tokens.component.button.adaptiveGlass.onDark.highlight).toBe(
      tokens.component.stickyActionBar.onDark.surface.highlight,
    );
    expect(tokens.component.button.adaptiveGlass.onDark.outline).toBe(
      tokens.component.stickyActionBar.onDark.surface.outline,
    );
    expect(tokens.component.button.adaptiveGlass.onDark.sheen).toBe(
      tokens.component.stickyActionBar.onDark.surface.sheen,
    );
    expect(tokens.component.stickyActionBar.backdropBlur).toBe("1rem");
    expect(tokens.component.stickyActionBar.background).toBe("rgb(244 248 252 / 16%)");
    expect(tokens.component.stickyActionBar.border).toBe("rgb(255 255 255 / 64%)");
    expect(tokens.component.stickyActionBar.highlight).toContain("rgb(255 255 255 / 88%)");
    expect(tokens.component.stickyActionBar.outline).toBe("rgb(34 78 130 / 8%)");
    expect(tokens.component.stickyActionBar.onDark.surface.border).toBe("rgb(161 198 242 / 56%)");
    expect(tokens.component.stickyActionBar.onDark.primary.background).toBe(
      tokens.color.surface.raised,
    );
    expect(tokens.component.stickyActionBar.onDark.primary.text).toBe(tokens.color.text.primary);
    expect(tokens.component.stickyActionBar.onDark.secondary.text).toBe(tokens.color.text.inverse);
    expect(tokens.component.stickyActionBar.onDark.status.saved).toBe(
      tokens.color.status.successHover,
    );
    expect(tokens.component.stickyActionBar.onDark.status.error).toBe(
      tokens.color.status.dangerHover,
    );
    expect(tokens.component.stickyActionBar.radius).toBe(tokens.shape.surface);
    expect(tokens.component.stickyActionBar.shadow).toBe(tokens.elevation.floating);
    expect(tokens.component.textarea.fontSize).toBe(tokens.font.size.sm);
    expect(tokens.component.textarea.fontWeight).toBe(tokens.typography.body.supporting.fontWeight);
    expect(tokens.component.tabs.indicator.background).toBe(tokens.color.surface.raised);
    expect(tokens.component.tabs.indicator.secondaryBackground).toBe(tokens.color.accent.secondary);
    expect(tokens.component.tabs.indicator.shadow).toBe(tokens.elevation.raised);
    expect(tokens.component.tabs.indicator.thickness).toBe("2px");
    expect(tokens.component.tabs.list.radius).toBe(tokens.space[5]);
    expect(tokens.component.tabs.list.trackThickness).toBe(tokens.border.width.thin);
    expect(tokens.component.tabs.radius).toBe(tokens.radius.pill);
    expect(tokens.component.tabs.tab.compactHeight).toBe(tokens.space[6]);
    expect(tokens.component.tabs.tab.height).toBe(tokens.space[8]);
    expect(tokens.component.tabs.tab.radius).toBe(tokens.radius.pill);
    expect(tokens.component.tabs.tab.textSelected).toBe(tokens.color.text.primary);
    expect(tokens.component.statusBadge.success.background).toBe(tokens.color.status.successSubtle);
    expect(tokens.component.statusBadge.radius).toBe(tokens.radius.pill);
    expect(tokens.component.statusBadge.checkMark).toBe(tokens.color.text.inverse);
    expect(tokens.component.statusBadge.fontWeight).toBe(tokens.font.weight.medium);
    expect(tokens.component.statusBadge.solidFontWeight).toBe(tokens.font.weight.regular);
    expect(tokens.component.statusBadge.size.sm.minHeight).toBe("1.5rem");
    expect(tokens.component.statusBadge.size.md.minHeight).toBe("1.75rem");
    expect(tokens.component.statusBadge.size.sm.paddingInline).toBe(tokens.space[2]);
    expect(tokens.component.statusBadge.size.md.paddingInline).toBe(tokens.space[3]);
    expect(tokens.component.statusBadge.size.sm.paddingInlineWithIcon).toBe(tokens.space[3]);
    expect(tokens.component.statusBadge.size.md.paddingInlineWithIcon).toBe(tokens.space[3]);
    expect(tokens.component.statusBadge.success.solid.background).toBe(tokens.color.status.success);
    expect(tokens.component.statusBadge.success.soft.background).toBe(
      tokens.color.status.successSurface,
    );
    expect(tokens.component.statusBadge.success.outline.border).toBe(
      tokens.color.status.successBorder,
    );
    expect(tokens.component.statusBadge.info.soft.text).toBe(tokens.color.status.infoStrong);
    expect(tokens.component.brandPanel.background).toBe(tokens.gradient.surface.brand);
    expect(tokens.component.brandPanel.backdropBlur).toBe(tokens.effect.blur.brandSurface);
    expect(tokens.component.brandPanel.border).toBe(tokens.color.border.brandSurface);
    expect(tokens.component.brandPanel.highlight).toBe(tokens.effect.highlight.brandSurface);
    expect(tokens.component.brandPanel.media.backdropBlur).toBe(tokens.effect.blur.brandMedia);
  });
});
