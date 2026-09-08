import { RadioGroup } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const confirmationOptions = [
  { label: "Mensagem por WhatsApp", value: "whatsapp" },
  { label: "Ligação da equipe", value: "ligacao" },
] as const;

const meta = {
  args: {
    defaultValue: "whatsapp",
    description: "Esta regra será aplicada aos próximos agendamentos.",
    label: "Como confirmar o agendamento?",
    name: "confirmacao",
    options: confirmationOptions,
    required: true,
  },
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Grupo para uma única escolha entre opções visíveis. Use Select quando a lista for longa ou precisar economizar espaço; não fragmente uma escolha única em checkboxes independentes.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/RadioGroup",
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selected = canvas.getByRole("radio", { name: "Mensagem por WhatsApp" });

    await expect(selected).toBeChecked();
    await expect(getComputedStyle(selected).borderRadius).toBe("999px");
    await expect(getComputedStyle(selected, "::before").transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
    await userEvent.tab();
    await expect(selected).toHaveFocus();
    await expect(getComputedStyle(selected).outlineStyle).toBe("solid");

    const alternative = canvas.getByRole("radio", { name: "Ligação da equipe" });
    await userEvent.click(alternative);
    await expect(alternative).toBeChecked();
  },
};

export const Erro: Story = {
  args: {
    defaultValue: "",
    error: "Escolha como o agendamento deve ser confirmado.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole("radio", { name: "Mensagem por WhatsApp" });

    await expect(getComputedStyle(option).borderRadius).toBe("999px");
    await expect(getComputedStyle(option).borderColor).toBe("rgb(154, 38, 38)");
    await expect(getComputedStyle(option).outlineStyle).toBe("none");
  },
};

export const Desabilitado: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("group")).toHaveAttribute("data-disabled", "true");
    await expect(canvas.getByRole("radio", { name: "Mensagem por WhatsApp" })).toBeDisabled();
    await expect(canvas.getByRole("radio", { name: "Ligação da equipe" })).toBeDisabled();
  },
};
