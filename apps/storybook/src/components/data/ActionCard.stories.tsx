import { PlusIcon } from "@clavia-ds/icons";
import { ActionCard } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  component: ActionCard,
  parameters: {
    docs: {
      description: {
        component:
          "Use para uma tarefa isolada e relevante no contexto atual. Métricas são somente leitura; destinos persistentes usam NavigationCard.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/ActionCard",
} satisfies Meta<typeof ActionCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CriarProjeto: Story = {
  args: {
    actionLabel: "Começar",
    description: "Registre objetivo, responsável e próxima etapa.",
    leadingIcon: <PlusIcon />,
    onAction: () => undefined,
    title: "Criar projeto",
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: /Criar projeto/ });
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

export const Indisponivel: Story = {
  args: {
    actionLabel: "Indisponível",
    description: "A importação será liberada depois da conexão da fonte de dados.",
    disabled: true,
    onAction: () => undefined,
    title: "Importar contatos",
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: /Importar contatos/ }),
    ).toBeDisabled();
  },
};
