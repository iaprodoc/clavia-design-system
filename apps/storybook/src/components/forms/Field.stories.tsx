import { Field, Input } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    children: <Input inputMode="tel" placeholder="(00) 00000-0000" />,
    help: "Usaremos este contato para atualizações.",
    id: "telefone",
    label: "Telefone",
    required: true,
  },
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Composição de rótulo, ajuda, obrigatoriedade, controle e erro. Quando `required` estiver no Field ou no controle, o componente inclui automaticamente o asterisco no token semântico de perigo e anuncia “obrigatório”; não escreva `*` no texto do label. Use `helpTooltip` para explicações curtas e opcionais sobre origem, responsabilidade, escopo ou configuração global, consultadas pelo ícone `?` ao lado do rótulo. Use `help` quando a pessoa precisar ler a instrução antes de preencher, como formato obrigatório ou limite que deve obedecer. A entrada suave é aplicada por padrão e respeita a preferência de redução de movimento; use motion='none' em listas densas ou montagens repetidas.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Field",
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas }) => {
    const marker = canvas.getByText("*");

    await expect(marker).toHaveClass("clv-field__required-marker");
    await expect(getComputedStyle(marker).color).not.toBe(
      getComputedStyle(marker.parentElement as Element).color,
    );
  },
};

export const Erro: Story = {
  args: {
    children: <Input defaultValue="123" inputMode="tel" />,
    error: "Informe um telefone válido.",
  },
};

export const SemMovimento: Story = {
  args: {
    motion: "none",
  },
  name: "Sem movimento",
};

export const OrientacaoContextual: Story = {
  args: {
    help: undefined,
    helpTooltip: "Use um nome que a equipe reconheça rapidamente.",
    id: "nome-projeto",
    label: "Nome do projeto",
    required: false,
  },
  name: "Orientação contextual",
  parameters: {
    docs: {
      description: {
        story:
          "Use `helpTooltip` para uma orientação curta e opcional. Explicações sobre onde uma configuração é validada, armazenada ou administrada pertencem ao ícone `?`, desde que não sejam necessárias para preencher o campo. A ajuda não é associada ao controle por `aria-describedby`; use `help` quando a pessoa precisar ler o conteúdo antes de preencher.",
      },
    },
  },
  play: async ({ canvas }) => {
    const help = canvas.getByRole("button", { name: "Mais informações sobre Nome do projeto" });
    await expect(help).toBeInTheDocument();
    await expect(getComputedStyle(help.querySelector("svg") as SVGElement).inlineSize).toBe("14px");
    await expect(canvas.getByRole("textbox", { name: "Nome do projeto" })).not.toHaveAttribute(
      "aria-describedby",
    );
  },
};
