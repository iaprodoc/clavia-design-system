import { BuildingIcon, MessageCircleIcon } from "@clavia-ds/icons";
import { type OptionCardOption, OptionCards } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

const attendanceOptions: readonly OptionCardOption[] = [
  {
    description: "Atendimento no consultório",
    icon: <BuildingIcon />,
    label: "Presencial",
    value: "presencial",
  },
  {
    description: "Teleconsulta com pacientes",
    icon: <MessageCircleIcon />,
    label: "Online",
    value: "online",
  },
  { description: "Presencial e online", label: "Ambos", value: "hibrido" },
];

const paymentOptions: readonly OptionCardOption[] = [
  { label: "PIX", value: "pix" },
  { label: "Cartão de crédito", value: "cartao" },
  { label: "Transferência", value: "transferencia" },
];

const meta = {
  args: {
    description: "Selecione a modalidade oferecida pela clínica.",
    label: "Modalidade de atendimento",
    name: "modalidade-atendimento",
    onValueChange: fn(),
    options: attendanceOptions,
    required: true,
    value: "presencial",
  },
  component: OptionCards,
  decorators: [
    (Story) => (
      <div style={{ maxInlineSize: "42rem" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Escolha uma ou mais alternativas curtas quando o conteúdo auxiliar facilita a comparação. Use Select para listas maiores ou quando a economia de espaço for mais importante. Não use para regras de domínio, etapas do fluxo ou ações de navegação.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/OptionCards",
} satisfies Meta<typeof OptionCards>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveOptionCards({
  onValueChange,
  value: initialValue,
  ...props
}: ComponentProps<typeof OptionCards>) {
  const [value, setValue] = useState(initialValue ?? props.defaultValue ?? "");

  return (
    <OptionCards
      {...props}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        onValueChange?.(nextValue);
      }}
      value={value}
    />
  );
}

export const EscolhaUnica: Story = {
  name: "Escolha única",
  render: (args) => <InteractiveOptionCards {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const online = canvas.getByRole("radio", { name: /Online/ });

    await expect(
      canvas.getByRole("group", { name: /Modalidade de atendimento/ }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("radio", { name: /^Presencial/ })).toBeChecked();
    await userEvent.click(online);
    await expect(args.onValueChange).toHaveBeenCalledWith("online");
    await expect(online).toBeChecked();
  },
};

export const EscolhaMultipla: Story = {
  name: "Escolha múltipla compacta",
  args: {
    label: "Formas de pagamento aceitas",
    multiple: true,
    name: "formas-pagamento",
    options: paymentOptions,
    value: ["pix"],
    variant: "compact",
  },
  render: (args) => <InteractiveOptionCards {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("checkbox", { name: "Cartão de crédito" }));
    await expect(args.onValueChange).toHaveBeenCalledWith(["pix", "cartao"]);
    await expect(canvas.getByRole("checkbox", { name: "Cartão de crédito" })).toBeChecked();
  },
};

export const Compacta: Story = {
  args: {
    description: undefined,
    label: "Formas de pagamento aceitas",
    multiple: true,
    name: "formas-pagamento-compactas",
    options: paymentOptions,
    value: ["pix"],
    variant: "compact",
  },
  name: "Compacta",
  render: (args) => <InteractiveOptionCards {...args} />,
};

export const Erro: Story = {
  args: {
    description: undefined,
    error: "Escolha uma modalidade para continuar.",
    value: "",
  },
};

export const Desabilitado: Story = {
  args: { disabled: true },
};

export const EmContainerEstreito: Story = {
  name: "Em container estreito",
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "18rem", maxInlineSize: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
