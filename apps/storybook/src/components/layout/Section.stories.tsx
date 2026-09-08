import { Button, Section } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  component: Section,
  parameters: {
    docs: {
      description: {
        component:
          "Agrupe um assunto dentro de uma página já nomeada. Use PageHeader para o contexto principal e mantenha decisões de fluxo, dados e roteamento no produto.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Layout/Section",
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ComAcoes: Story = {
  args: {
    actions: <Button variant="secondary">Editar responsáveis</Button>,
    children: "Marina Almeida · Operações",
    description: "Pessoas que acompanham esta etapa.",
    title: "Responsáveis",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Responsáveis" })).toBeVisible();
  },
};

export const ConteudoExtenso: Story = {
  args: {
    children: (
      <>
        <p>Marina Almeida acompanha a preparação do cadastro e consolida as respostas da equipe.</p>
        <p>
          As próximas atualizações ficam registradas neste assunto para preservar contexto na
          página.
        </p>
      </>
    ),
    description: "Pessoas que acompanham esta etapa.",
    title: "Responsáveis",
  },
};

export const Compacta: Story = {
  args: {
    actions: <Button variant="secondary">Editar</Button>,
    children: "Marina Almeida · Operações",
    title: "Responsáveis",
  },
  render: (args) => (
    <div style={{ maxInlineSize: "22rem" }}>
      <Section {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Responsáveis" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Editar" })).toBeVisible();
  },
};
