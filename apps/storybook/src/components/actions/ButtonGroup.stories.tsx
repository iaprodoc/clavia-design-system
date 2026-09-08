import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "@clavia-ds/icons";
import { Button, ButtonGroup } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Agrupa ações da mesma tarefa e preserva a hierarquia de cada botão. Não use como navegação ou para agrupar ações sem relação direta.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Ações/ButtonGroup",
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: "Padrão",
  args: {
    children: (
      <>
        <Button>Voltar</Button>
        <Button>Continuar</Button>
      </>
    ),
    label: "Ações do formulário",
    variant: "primary",
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("group", { name: "Ações do formulário" }),
    ).toBeVisible();
  },
};

export const Vertical: Story = {
  args: {
    children: (
      <>
        <Button>Resolver agora</Button>
        <Button variant="secondary">Ver detalhes</Button>
      </>
    ),
    label: "Ações do alerta",
    orientation: "vertical",
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Ações do alerta" });

    await expect(group).not.toHaveClass("clv-button-group--joined");
    await expect(within(group).getAllByRole("button")).toHaveLength(2);
  },
};

export const Compacto: Story = {
  args: {
    children: (
      <>
        <Button variant="secondary">Salvar rascunho</Button>
        <Button>Publicar</Button>
      </>
    ),
    label: "Ações compactas",
  },
  render: (args) => (
    <div style={{ maxInlineSize: "18rem" }}>
      <ButtonGroup {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Ações compactas" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Publicar" })).toBeVisible();
  },
};

export const Variantes: Story = {
  args: { children: null, label: "Variantes de ações" },
  name: "Variantes",
  render: () => (
    <div className="clv-story-stack">
      {(
        ["primary", "secondary", "tertiary", "outline", "ghost", "danger", "danger-soft"] as const
      ).map((variant) => (
        <ButtonGroup key={variant} label={`Ações ${variant}`} variant={variant}>
          <Button>Primeira</Button>
          <Button>Segunda</Button>
          <Button>Terceira</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  args: { children: null, label: "Tamanhos de ações" },
  name: "Tamanhos",
  render: () => (
    <div className="clv-story-stack">
      <ButtonGroup label="Ações pequenas" size="sm" variant="primary">
        <Button>Pequena</Button>
        <Button>Pequena</Button>
      </ButtonGroup>
      <ButtonGroup label="Ações médias" size="md" variant="primary">
        <Button>Média</Button>
        <Button>Média</Button>
      </ButtonGroup>
      <ButtonGroup label="Ações grandes" size="lg" variant="primary">
        <Button>Grande</Button>
        <Button>Grande</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const smallGroup = canvas.getByRole("group", { name: "Ações pequenas" });
    const mediumGroup = canvas.getByRole("group", { name: "Ações médias" });
    const largeGroup = canvas.getByRole("group", { name: "Ações grandes" });
    const smallButton = within(smallGroup).getAllByRole("button")[0];
    const mediumButton = within(mediumGroup).getAllByRole("button")[0];
    const largeButton = within(largeGroup).getAllByRole("button")[0];

    await expect(smallButton).toBeDefined();
    await expect(mediumButton).toBeDefined();
    await expect(largeButton).toBeDefined();
    await expect(getComputedStyle(smallButton as HTMLElement).height).toBe("32px");
    await expect(getComputedStyle(smallButton as HTMLElement).fontSize).toBe("12px");
    await expect(getComputedStyle(mediumButton as HTMLElement).height).toBe("40px");
    await expect(getComputedStyle(largeButton as HTMLElement).height).toBe("44px");
  },
};

export const LarguraTotal: Story = {
  args: { children: null, label: "Ações em coluna" },
  name: "Largura total",
  render: () => (
    <div style={{ inlineSize: "100%", maxInlineSize: "24rem" }}>
      <ButtonGroup fullWidth label="Ações em coluna" variant="primary">
        <Button>Voltar</Button>
        <Button>Continuar</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Desabilitado: Story = {
  args: { children: null, label: "Ações indisponíveis" },
  name: "Desabilitado",
  render: () => (
    <ButtonGroup isDisabled label="Ações indisponíveis" variant="primary">
      <Button>Primeira</Button>
      <Button>Segunda</Button>
      <Button isDisabled={false}>Disponível</Button>
    </ButtonGroup>
  ),
};

export const ComIcones: Story = {
  args: { children: null, label: "Ações de registro" },
  name: "Com ícones",
  render: () => (
    <ButtonGroup label="Ações de registro" variant="primary">
      <Button leadingIcon={<ArrowLeftIcon />}>Voltar</Button>
      <Button trailingIcon={<ArrowRightIcon />}>Avançar</Button>
      <Button leadingIcon={<TrashIcon />}>Excluir</Button>
    </ButtonGroup>
  ),
};

export const SemSeparador: Story = {
  args: { children: null, label: "Ações sem separador" },
  name: "Sem separador",
  render: () => (
    <ButtonGroup hideSeparator label="Ações sem separador" variant="primary">
      <Button>Primeira</Button>
      <Button>Segunda</Button>
      <Button>Terceira</Button>
    </ButtonGroup>
  ),
};

export const Exemplos: Story = {
  args: { children: null, label: "Exemplos de grupos" },
  name: "Exemplos",
  render: () => (
    <div className="clv-story-stack">
      <ButtonGroup label="Ações horizontais" variant="primary">
        <Button>Voltar</Button>
        <Button>Continuar</Button>
      </ButtonGroup>
      <ButtonGroup label="Ações verticais" orientation="vertical" variant="secondary">
        <Button>Resolver agora</Button>
        <Button>Ver detalhes</Button>
      </ButtonGroup>
    </div>
  ),
};
