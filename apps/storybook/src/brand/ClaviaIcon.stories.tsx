import { ClaviaIcon } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    size: 128,
  },
  argTypes: {
    size: {
      control: { min: 16, step: 1, type: "number" },
    },
  },
  component: ClaviaIcon,
  parameters: {
    docs: {
      description: {
        component:
          "Redução principal oficial da Clavia para espaços quadrados e compactos. O vetor preserva símbolo, gradiente e moldura aprovados; o consumidor controla apenas tamanho e nome acessível. Use em favicon, app switcher e sidebar recolhida. Não substitua ícones funcionais por esta marca e não altere cores, proporção, cantos ou efeitos.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Visão geral/Marca/Ícone",
} satisfies Meta<typeof ClaviaIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReducaoPrincipal: Story = {
  name: "Redução principal",
  parameters: {
    docs: {
      description: {
        story:
          "Aplicação principal da redução oficial. Preserve espaço livre ao redor e prefira a assinatura horizontal quando houver largura suficiente.",
      },
    },
  },
};

const usageScales = [
  { label: "Favicon", size: 16 },
  { label: "Sidebar recolhida", size: 32 },
  { label: "App switcher", size: 48 },
  { label: "Launcher", size: 64 },
] as const;

export const EscalasDeUso: Story = {
  name: "Escalas de uso",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Comparação de escalas recorrentes em superfícies digitais. O contexto pode ajustar a dimensão, desde que o símbolo permaneça reconhecível e sem deformação.",
      },
    },
  },
  render: () => (
    <section aria-label="Escalas do ícone Clavia" className="clv-story-icon-scales">
      {usageScales.map(({ label, size }) => (
        <figure className="clv-story-icon-scale" key={label}>
          <div className="clv-story-icon-frame">
            <ClaviaIcon aria-label={`Clavia, aplicação ${label}`} size={size} />
          </div>
          <figcaption>
            <strong>{label}</strong>
            <span>{size}px</span>
          </figcaption>
        </figure>
      ))}
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icons = canvas.getAllByRole("img");

    await expect(icons).toHaveLength(4);

    for (const [index, icon] of icons.entries()) {
      const scale = usageScales[index];

      if (!scale) {
        throw new Error("Escala do ícone não encontrada.");
      }

      await expect(icon).toHaveAttribute("width", String(scale.size));
      await expect(icon).toHaveAttribute("height", String(scale.size));
    }
  },
};
