import { Switch } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    description: "A clínica recebe uma confirmação após cada solicitação.",
    label: "Enviar confirmação por WhatsApp",
  },
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          "Alterna uma configuração que entra em vigor imediatamente ou tem efeito claramente explicado. Não use para confirmação final, aceite de termos ou seleção entre várias opções.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Switch",
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desligado: Story = {};

export const Ligado: Story = {
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch");
    const track = canvasElement.querySelector<HTMLElement>(".clv-switch__track");

    await expect(control).toBeChecked();
    await expect(track).not.toBeNull();

    if (track) {
      await expect(getComputedStyle(track).boxShadow).toBe("none");
    }
  },
};

export const Desabilitado: Story = {
  args: {
    description: "Esta opção ficará disponível após ativar a integração.",
    disabled: true,
    label: "Lembrar a pessoa atendida",
  },
};

export const Erro: Story = {
  args: {
    error: "Ative a confirmação para continuar.",
    label: "Enviar confirmação",
  },
};

export const Tamanhos: Story = {
  name: "Tamanhos",
  render: (args) => (
    <div className="clv-story-stack">
      <Switch {...args} label="Pequeno" size="sm" />
      <Switch {...args} label="Médio" size="md" />
      <Switch {...args} label="Grande" size="lg" />
    </div>
  ),
};
