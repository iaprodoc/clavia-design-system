import { Field, Textarea } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  args: {
    maxLength: 120,
    placeholder: "Escreva uma orientação para a equipe.",
  },
  component: Textarea,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "23.75rem", width: "calc(100vw - 2rem)" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Campo para textos de várias linhas, com limite e contador opcionais. Rótulo, ajuda, obrigatoriedade e erro são compostos com Field.",
      },
    },
    layout: "centered",
  },
  render: (args) => (
    <Field
      help="Evite informações sensíveis ou instruções ambíguas."
      id="orientacao-equipe"
      label="Orientação para a equipe"
    >
      <Textarea {...args} />
    </Field>
  ),
  tags: ["autodocs"],
  title: "Componentes/Formulários/Textarea",
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
};

export const Preenchido: Story = {
  args: {
    defaultValue: "Retornar o contato em até um dia útil.",
  },
  name: "Preenchido",
};

export const Erro: Story = {
  name: "Erro",
  render: (args) => (
    <Field
      error="Descreva como a clínica deve orientar o paciente."
      id="orientacao-erro"
      label="Orientação para a equipe"
      required
    >
      <Textarea {...args} />
    </Field>
  ),
};

export const Desabilitado: Story = {
  args: {
    defaultValue: "Esta orientação só pode ser alterada por administradores.",
    disabled: true,
  },
  name: "Desabilitado",
};

export const Interacao: Story = {
  args: {
    placeholder: "Digite uma orientação.",
  },
  name: "Foco, digitação e contador",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox", { name: "Orientação para a equipe" });
    const field = canvasElement.querySelector<HTMLElement>(".clv-field");
    const label = canvasElement.querySelector<HTMLElement>(".clv-field__label");
    const value = "Retornar em até um dia útil.";

    if (!field || !label) {
      throw new Error("Field do Textarea não encontrado.");
    }

    await expect(getComputedStyle(field).animationName).toBe("clv-field-enter");
    await expect(getComputedStyle(label).fontWeight).toBe("500");
    await expect(getComputedStyle(textarea).fontSize).toBe("14px");
    await expect(getComputedStyle(textarea).fontWeight).toBe("400");
    await userEvent.click(textarea);
    await expect(textarea).toHaveFocus();
    await userEvent.type(textarea, value);

    await expect(textarea).toHaveValue(value);
    await expect(canvas.getByText(`${value.length}/120`)).toBeVisible();
  },
};
