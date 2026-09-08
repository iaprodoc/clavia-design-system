import { NativeSelect } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    "aria-label": "Especialidade",
    defaultValue: "dermatologia",
  },
  component: NativeSelect,
  parameters: {
    docs: {
      description: {
        component:
          "Alternativa nativa para contextos em que o seletor do sistema operacional é preferível. Novos fluxos do App usam Select; este componente não funciona como ponte de compatibilidade com React 18.",
      },
    },
  },
  render: (args) => (
    <NativeSelect {...args}>
      <option value="dermatologia">Dermatologia</option>
      <option value="cardiologia">Cardiologia</option>
      <option value="pediatria">Pediatria</option>
    </NativeSelect>
  ),
  tags: ["autodocs"],
  title: "Componentes/Formulários/NativeSelect",
} satisfies Meta<typeof NativeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector<HTMLElement>(".clv-native-select");
    const indicator = canvasElement.querySelector<HTMLElement>(".clv-native-select__indicator");

    if (!select || !indicator) {
      throw new Error("Select nativo ou indicador não encontrado.");
    }

    await expect(getComputedStyle(select).paddingInlineEnd).toBe("36px");
    await expect(getComputedStyle(indicator).insetInlineEnd).toBe("12px");
  },
};

export const Desabilitado: Story = {
  args: { disabled: true },
};
