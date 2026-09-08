import { Field, InputOTP } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  args: {
    "aria-label": "Código de acesso",
    length: 6,
  },
  component: InputOTP,
  parameters: {
    docs: {
      description: {
        component:
          "Campo compacto para códigos curtos, com um único input de texto acessível e posições visuais derivadas do valor. Componha com Field para rótulo, ajuda e erro; valide o código no produto e não use este controle para senhas longas.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/InputOTP",
} satisfies Meta<typeof InputOTP>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vazio: Story = {
  name: "Vazio",
};

export const Interacoes: Story = {
  name: "Interações críticas",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Código de acesso" });
    const root = input.closest<HTMLElement>(".clv-input-otp");

    if (!root) {
      throw new Error("Estrutura visual do InputOTP não encontrada.");
    }

    await userEvent.click(input);
    await expect(getComputedStyle(root).outlineStyle).toBe("none");
    await userEvent.type(input, "274");
    await expect(input).toHaveValue("274");
    await expect(canvasElement.querySelectorAll(".clv-input-otp__slot")).toHaveLength(6);
  },
};

export const Preenchido: Story = {
  args: { defaultValue: "274159" },
};

export const ComField: Story = {
  name: "Com Field",
  render: (args) => (
    <Field
      error="O código informado expirou."
      help="Informe o código de seis dígitos recebido pela equipe."
      id="codigo-de-acesso"
      label="Código de acesso"
      required
    >
      <InputOTP {...args} aria-label={undefined} />
    </Field>
  ),
};

export const Desabilitado: Story = {
  args: { defaultValue: "274", disabled: true },
};
