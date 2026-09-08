import { tokens } from "@clavia-ds/tokens";

export const colorSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const primitiveColorFamilies = [
  { label: "Neutros", token: "gray" },
  { label: "Azul Clavia", token: "blue" },
  { label: "Information", token: "info" },
  { label: "Success", token: "green" },
  { label: "Warning", token: "amber" },
  { label: "Error", token: "red" },
] as const;

const primitiveColorValues = {
  amber: tokens.color.primitive.amber,
  blue: tokens.color.primitive.blue,
  gray: tokens.color.primitive.gray,
  green: tokens.color.primitive.green,
  info: tokens.color.primitive.info,
  red: tokens.color.primitive.red,
} as const;

export function getPrimitiveColorValue(
  family: keyof typeof primitiveColorValues,
  step: (typeof colorSteps)[number],
) {
  return primitiveColorValues[family][step];
}

export const semanticColorGroups = [
  {
    description: "Canvas, painéis e camadas que estruturam a interface.",
    label: "Superfícies",
    tokens: [
      {
        label: "Canvas",
        token: "--clv-color-surface-canvas",
        value: tokens.color.surface.canvas,
      },
      {
        label: "Elevada",
        token: "--clv-color-surface-raised",
        value: tokens.color.surface.raised,
      },
      {
        label: "Sutil",
        token: "--clv-color-surface-subtle",
        value: tokens.color.surface.subtle,
      },
      {
        label: "Rebaixada",
        token: "--clv-color-surface-sunken",
        value: tokens.color.surface.sunken,
      },
      {
        label: "Inversa",
        token: "--clv-color-surface-inverse",
        value: tokens.color.surface.inverse,
      },
      {
        label: "Marca",
        token: "--clv-color-surface-brand",
        value: tokens.color.surface.brand,
      },
      {
        label: "Marca sutil",
        token: "--clv-color-surface-brand-subtle",
        value: tokens.color.surface.brandSubtle,
      },
    ],
  },
  {
    description: "Hierarquia de leitura para conteúdo padrão, auxiliar e superfícies inversas.",
    label: "Texto",
    tokens: [
      {
        label: "Primário",
        token: "--clv-color-text-primary",
        value: tokens.color.text.primary,
      },
      {
        label: "Secundário",
        token: "--clv-color-text-secondary",
        value: tokens.color.text.secondary,
      },
      {
        label: "Auxiliar",
        token: "--clv-color-text-muted",
        value: tokens.color.text.muted,
      },
      {
        label: "Inverso",
        token: "--clv-color-text-inverse",
        value: tokens.color.text.inverse,
      },
      {
        label: "Sobre marca",
        token: "--clv-color-text-on-brand",
        value: tokens.color.text.onBrand,
      },
      {
        label: "Sobre marca auxiliar",
        token: "--clv-color-text-on-brand-muted",
        value: tokens.color.text.onBrandMuted,
      },
    ],
  },
  {
    description: "Cores interativas para ações primárias, secundárias e seus estados.",
    label: "Ações",
    tokens: [
      {
        label: "Primária",
        token: "--clv-color-action-primary",
        value: tokens.color.action.primary,
      },
      {
        label: "Primária hover",
        token: "--clv-color-action-primary-hover",
        value: tokens.color.action.primaryHover,
      },
      {
        label: "Primária ativa",
        token: "--clv-color-action-primary-active",
        value: tokens.color.action.primaryActive,
      },
      {
        label: "Primária sutil",
        token: "--clv-color-action-primary-subtle",
        value: tokens.color.action.primarySubtle,
      },
      {
        label: "Primária sutil hover",
        token: "--clv-color-action-primary-subtle-hover",
        value: tokens.color.action.primarySubtleHover,
      },
      {
        label: "Secundária",
        token: "--clv-color-action-secondary",
        value: tokens.color.action.secondary,
      },
      {
        label: "Secundária hover",
        token: "--clv-color-action-secondary-hover",
        value: tokens.color.action.secondaryHover,
      },
    ],
  },
  {
    description: "Separação, contorno e limites sobre superfícies de marca.",
    label: "Bordas",
    tokens: [
      {
        label: "Sutil",
        token: "--clv-color-border-subtle",
        value: tokens.color.border.subtle,
      },
      {
        label: "Padrão",
        token: "--clv-color-border-default",
        value: tokens.color.border.default,
      },
      {
        label: "Forte",
        token: "--clv-color-border-strong",
        value: tokens.color.border.strong,
      },
      {
        label: "Foco",
        token: "--clv-color-border-focus",
        value: tokens.color.border.focus,
      },
      {
        label: "Superfície de marca",
        token: "--clv-color-border-brand-surface",
        value: tokens.color.border.brandSurface,
      },
      {
        label: "Sobre marca",
        token: "--clv-color-border-on-brand",
        value: tokens.color.border.onBrand,
      },
    ],
  },
  {
    description:
      "Orientação de teclado separada das bordas estruturais; border.focus permanece como alias compatível.",
    label: "Foco",
    tokens: [
      {
        label: "Contorno sólido",
        token: "--clv-color-focus-outline",
        value: tokens.color.focus.outline,
      },
      {
        label: "Halo translúcido",
        token: "--clv-color-focus-ring",
        value: tokens.color.focus.ring,
      },
    ],
  },
  {
    description: "Ênfase principal da interface e seus estados interativos.",
    label: "Acento",
    tokens: [
      {
        label: "Padrão",
        token: "--clv-color-accent",
        value: tokens.color.accent.default,
      },
      {
        label: "Hover",
        token: "--clv-color-accent-hover",
        value: tokens.color.accent.hover,
      },
      {
        label: "Ativo",
        token: "--clv-color-accent-active",
        value: tokens.color.accent.active,
      },
      {
        label: "Secundário · realce sobre fundo escuro",
        token: "--clv-color-accent-secondary",
        value: tokens.color.accent.secondary,
      },
    ],
  },
] as const;

export const statusColorFamilies = [
  { label: "Information", token: "info" },
  { label: "Neutral", token: "neutral" },
  { label: "Success", token: "success" },
  { label: "Warning", token: "warning" },
  { label: "Error", token: "danger" },
] as const;

export const statusColorRoles = [
  { label: "Fundo sutil", suffix: "-subtle" },
  { label: "Superfície", suffix: "-surface" },
  { label: "Hover", suffix: "-hover" },
  { label: "Ativo", suffix: "-active" },
  { label: "Borda", suffix: "-border" },
  { label: "Texto", suffix: "" },
  { label: "Texto forte", suffix: "-strong" },
] as const;

const statusColorValues = {
  danger: {
    "": tokens.color.status.danger,
    "-active": tokens.color.status.dangerActive,
    "-border": tokens.color.status.dangerBorder,
    "-hover": tokens.color.status.dangerHover,
    "-strong": tokens.color.status.dangerStrong,
    "-subtle": tokens.color.status.dangerSubtle,
    "-surface": tokens.color.status.dangerSurface,
  },
  info: {
    "": tokens.color.status.info,
    "-active": tokens.color.status.infoActive,
    "-border": tokens.color.status.infoBorder,
    "-hover": tokens.color.status.infoHover,
    "-strong": tokens.color.status.infoStrong,
    "-subtle": tokens.color.status.infoSubtle,
    "-surface": tokens.color.status.infoSurface,
  },
  neutral: {
    "": tokens.color.status.neutral,
    "-active": tokens.color.status.neutralActive,
    "-border": tokens.color.status.neutralBorder,
    "-hover": tokens.color.status.neutralHover,
    "-strong": tokens.color.status.neutralStrong,
    "-subtle": tokens.color.status.neutralSubtle,
    "-surface": tokens.color.status.neutralSurface,
  },
  success: {
    "": tokens.color.status.success,
    "-active": tokens.color.status.successActive,
    "-border": tokens.color.status.successBorder,
    "-hover": tokens.color.status.successHover,
    "-strong": tokens.color.status.successStrong,
    "-subtle": tokens.color.status.successSubtle,
    "-surface": tokens.color.status.successSurface,
  },
  warning: {
    "": tokens.color.status.warning,
    "-active": tokens.color.status.warningActive,
    "-border": tokens.color.status.warningBorder,
    "-hover": tokens.color.status.warningHover,
    "-strong": tokens.color.status.warningStrong,
    "-subtle": tokens.color.status.warningSubtle,
    "-surface": tokens.color.status.warningSurface,
  },
} as const;

export function getStatusColorValue(
  family: keyof typeof statusColorValues,
  suffix: (typeof statusColorRoles)[number]["suffix"],
) {
  return statusColorValues[family][suffix];
}
