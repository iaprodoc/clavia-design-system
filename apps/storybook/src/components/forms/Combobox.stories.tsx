import { Combobox } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const specialtyOptions = [
  {
    description: "Atendimento do coração e da circulação.",
    label: "Cardiologia",
    value: "cardio",
  },
  {
    description: "Atendimento de crianças e adolescentes.",
    label: "Pediatria",
    value: "pediatria",
  },
  {
    description: "Atendimento do sistema digestivo.",
    label: "Gastroenterologia",
    value: "gastro",
  },
  { disabled: true, label: "Neurologia", value: "neuro" },
] as const;

const meta = {
  args: {
    label: "Especialidade",
    options: specialtyOptions,
  },
  component: Combobox,
  decorators: [
    (Story) => (
      <div className="clv-story-combobox-preview">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Controle de seleção única para listas conhecidas que precisam de busca. A API, os tokens e as classes pertencem à Clavia, com comportamento acessível encapsulado no componente. Valores livres, múltipla seleção e carregamento assíncrono não fazem parte deste componente.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/Combobox",
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BuscaESelecao: Story = {
  args: {
    description: "Digite para reduzir a lista de opções.",
    label: "Especialidade",
    name: "especialidade",
    options: specialtyOptions,
    required: true,
  },
  name: "Busca e seleção",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Especialidade" });
    const label = canvasElement.querySelector<HTMLElement>(".clv-combobox__label");

    if (!label) {
      throw new Error("Label do Combobox não encontrado.");
    }

    await expect(getComputedStyle(label).fontWeight).toBe("500");
    await userEvent.click(canvas.getByRole("button", { name: /Mostrar opções/ }));
    await userEvent.click(input);
    await expect(getComputedStyle(input).boxShadow).toBe("none");
    await userEvent.type(input, "card");
    const option = page.getByRole("option", { name: /Cardiologia/ });
    const popover =
      canvasElement.ownerDocument.querySelector<HTMLElement>(".clv-combobox__popover");
    const inputGroup = input.closest<HTMLElement>(".clv-combobox__input-group");

    await expect(option).toBeVisible();

    if (!popover || !inputGroup) {
      throw new Error("Popover ou grupo do Combobox não encontrado.");
    }

    const popoverGap = Math.round(
      popover.getBoundingClientRect().top - inputGroup.getBoundingClientRect().bottom,
    );

    await expect(popoverGap).toBeGreaterThanOrEqual(7);
    await expect(popoverGap).toBeLessThanOrEqual(8);
    await userEvent.keyboard("{ArrowDown}{Enter}");

    await expect(input).toHaveValue("Cardiologia");
  },
};

export const EstadosDeValidacao: Story = {
  name: "Erro e desabilitado",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const invalidInput = canvas.getAllByRole("combobox", { name: "Especialidade" })[0];

    if (!invalidInput) {
      throw new Error("Combobox inválido não encontrado.");
    }

    const invalidGroup = invalidInput.closest<HTMLElement>(".clv-combobox__input-group");

    if (!invalidGroup) {
      throw new Error("Grupo inválido do Combobox não encontrado.");
    }

    await userEvent.click(invalidInput);

    const inputStyles = getComputedStyle(invalidInput);
    const groupStyles = getComputedStyle(invalidGroup);

    await expect(inputStyles.borderRadius).toBe(groupStyles.borderRadius);
    await expect(groupStyles.borderColor).toBe("rgb(154, 38, 38)");
    await expect(groupStyles.boxShadow).toContain("inset");
    await expect(groupStyles.boxShadow).not.toContain("34, 78, 130");
  },
  render: () => (
    <div className="clv-story-stack">
      <Combobox
        error="Escolha uma especialidade para continuar."
        label="Especialidade"
        options={specialtyOptions}
      />
      <Combobox
        defaultValue="pediatria"
        disabled
        label="Especialidade"
        options={specialtyOptions}
      />
    </div>
  ),
};

export const SemResultados: Story = {
  args: {
    defaultInputValue: "Odontologia",
    defaultOpen: true,
    label: "Especialidade",
    options: specialtyOptions,
  },
  name: "Sem resultados",
  parameters: {
    docs: {
      description: {
        story:
          "A ausência de resultados aparece em texto e não encerra a busca. A mensagem pode ser adaptada ao contexto sem alterar o comportamento do controle.",
      },
    },
  },
};
