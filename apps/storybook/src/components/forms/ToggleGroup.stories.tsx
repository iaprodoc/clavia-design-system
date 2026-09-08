import { ToggleGroup, ToggleGroupItem } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

const meta = {
  args: {
    children: null,
    type: "multiple",
  },
  component: ToggleGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Agrupa botões que ativam ou desativam ações relacionadas. O grupo não substitui RadioGroup ou Checkbox: seus itens comunicam ações pressionadas, não respostas de formulário.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/ToggleGroup",
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderMultipleActions = () => (
  <ToggleGroup aria-label="Canais habilitados" defaultValue={["email"]} type="multiple">
    <ToggleGroupItem value="email">E-mail</ToggleGroupItem>
    <ToggleGroupItem value="whatsapp">WhatsApp</ToggleGroupItem>
    <ToggleGroupItem value="telefone">Telefone</ToggleGroupItem>
  </ToggleGroup>
);

export const MultiplasAcoes: Story = {
  name: "Múltiplas ações",
  render: renderMultipleActions,
};

export const Interacoes: Story = {
  name: "Interações críticas",
  render: renderMultipleActions,
  play: async ({ canvas }) => {
    const whatsapp = canvas.getByRole("button", { name: "WhatsApp" });

    await expect(whatsapp).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(whatsapp);
    await expect(whatsapp).toHaveAttribute("aria-pressed", "true");
  },
};

export const AcaoUnica: Story = {
  name: "Ação única",
  render: () => (
    <ToggleGroup
      aria-label="Modo de visualização"
      defaultValue="lista"
      type="single"
      variant="outline"
    >
      <ToggleGroupItem value="lista">Lista</ToggleGroupItem>
      <ToggleGroupItem value="grade">Grade</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const VerticalDesabilitado: Story = {
  name: "Vertical desabilitado",
  render: () => (
    <ToggleGroup
      aria-label="Canais disponíveis"
      disabled
      orientation="vertical"
      type="multiple"
      value={["email"]}
    >
      <ToggleGroupItem value="email">E-mail</ToggleGroupItem>
      <ToggleGroupItem value="whatsapp">WhatsApp</ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvas }) => {
    const email = canvas.getByRole("button", { name: "E-mail" });
    const whatsapp = canvas.getByRole("button", { name: "WhatsApp" });

    await expect(getComputedStyle(email).justifyContent).toBe("center");
    await expect(getComputedStyle(whatsapp).justifyContent).toBe("center");
  },
};
