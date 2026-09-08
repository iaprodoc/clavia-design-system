import { BrandPanel, Button } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  args: {
    actions: <Button variant="glass">Continuar</Button>,
    description: "Revise o resumo antes de avançar para a próxima fase.",
    eyebrow: "Marco do onboarding",
    title: "Sua configuração está pronta para validação.",
  },
  component: BrandPanel,
  decorators: [
    (Story) => (
      <div style={{ background: "var(--clv-color-surface-brand)", padding: "var(--clv-space-8)" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Superfície expressiva para boas-vindas, resumos e marcos do onboarding. Não use em formulários, tabelas, erros, alertas ou ações recorrentes; o conteúdo precisa continuar compreensível sem mídia decorativa.",
      },
    },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/BrandPanel",
} satisfies Meta<typeof BrandPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = { name: "Padrão" };
