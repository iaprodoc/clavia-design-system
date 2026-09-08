import { Select } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const attendanceOptions = [
  { label: "Presencial", value: "presencial" },
  { label: "Remoto", value: "remoto" },
  { label: "Híbrido", value: "hibrido" },
  { disabled: true, label: "Domiciliar", value: "domiciliar" },
] as const;

const meta = {
  args: {
    description: "Escolha a opção que melhor representa a rotina atual.",
    label: "Tipo de atendimento",
    name: "tipo-atendimento",
    options: attendanceOptions,
    required: true,
  },
  component: Select,
  decorators: [
    (Story) => (
      <div className="clv-story-select-preview">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Escolha única em uma lista curta. A implementação App-first reúne rótulo, ajuda, erro, foco, teclado e opções desabilitadas no mesmo contrato.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Select",
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Tipo de atendimento/ });
    const indicator = trigger.querySelector(".clv-select__indicator");
    const value = trigger.querySelector(".clv-select__value");

    if (!(indicator instanceof HTMLElement) || !(value instanceof HTMLElement)) {
      throw new Error("O Select deve conter seus slots de valor e indicador.");
    }

    const triggerBounds = trigger.getBoundingClientRect();
    const indicatorBounds = indicator.getBoundingClientRect();
    const valueBounds = value.getBoundingClientRect();
    const paddingStart = Number.parseFloat(getComputedStyle(trigger).paddingInlineStart);
    const paddingEnd = Number.parseFloat(getComputedStyle(trigger).paddingInlineEnd);

    await expect(
      Math.abs(valueBounds.left - triggerBounds.left - paddingStart),
    ).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(triggerBounds.right - indicatorBounds.right - paddingEnd),
    ).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(
        triggerBounds.top + triggerBounds.height / 2 - (valueBounds.top + valueBounds.height / 2),
      ),
    ).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(
        triggerBounds.top +
          triggerBounds.height / 2 -
          (indicatorBounds.top + indicatorBounds.height / 2),
      ),
    ).toBeLessThanOrEqual(1);

    trigger.focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await expect(trigger).toHaveTextContent("Remoto");
  },
};

export const Aberto: Story = {
  args: { defaultOpen: true },
};

export const Erro: Story = {
  args: {
    description: undefined,
    error: "Escolha um tipo de atendimento para continuar.",
  },
};

export const Desabilitado: Story = {
  args: { defaultValue: "remoto", disabled: true },
};
