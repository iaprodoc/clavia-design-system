import { Spinner } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const tones = [
  "neutral",
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "danger",
  "inverse",
] as const;

const meta = {
  args: {
    label: "Carregando dados",
    size: "md",
    tone: "primary",
  },
  argTypes: {
    size: { control: "select", options: sizes },
    tone: { control: "select", options: tones },
  },
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          "Indicador de espera indeterminada com trilha e arco giratório. Use quando não for possível calcular o avanço; para progresso mensurável, use Progress. O componente oferece cinco tamanhos e oito tons mapeados aos tokens semânticos da Clavia.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Progresso/Spinner",
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="clv-story-spinner-grid">
      {sizes.map((size) => (
        <div className="clv-story-spinner-sample" key={size}>
          <span>{size}</span>
          <Spinner {...args} label={`Carregando — tamanho ${size}`} size={size} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("status")).toHaveLength(5);
  },
};

export const Cores: Story = {
  render: (args) => (
    <div className="clv-story-spinner-grid">
      {tones.map((tone) => (
        <div
          className={`clv-story-spinner-sample${tone === "inverse" ? " clv-story-spinner-sample--inverse" : ""}`}
          key={tone}
        >
          <span>{tone}</span>
          <Spinner {...args} label={`Carregando — tom ${tone}`} tone={tone} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("status")).toHaveLength(8);
  },
};
