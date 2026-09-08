import { Tooltip } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
  args: {
    children: (
      <span aria-hidden="true" className="clv-story-tooltip-trigger">
        i
      </span>
    ),
    content: "Processo Comercial",
    placement: "top",
    showArrow: true,
    triggerLabel: "Informações sobre Processo Comercial",
  },
  argTypes: {
    children: { control: false },
    content: { control: "text" },
    placement: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
  },
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "Apresenta informação complementar curta por hover, foco ou toque. Por padrão, abre acima e centralizado no disparador; muda de lado apenas quando faltar espaço para não ser cortado. O disparador precisa de um nome acessível e o conteúdo não pode ser a única fonte de uma instrução essencial. Evite textos longos, ações ou campos dentro do Tooltip; nesses casos, use Popover ou Dialog.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/Tooltip",
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: "Informações sobre Processo Comercial",
    });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    const tooltip = await within(document.body).findByRole("tooltip");
    await expect(tooltip).toHaveTextContent("Processo Comercial");
    await expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    await expect(tooltip).toHaveAttribute(
      "data-placement",
      expect.stringMatching(/^(top|bottom)$/),
    );
    await expect(getComputedStyle(tooltip).backgroundColor).toBe("rgb(2, 24, 38)");
    await expect(getComputedStyle(tooltip).color).toBe("rgb(255, 255, 255)");

    await userEvent.tab();
    await waitFor(() => expect(within(document.body).queryByRole("tooltip")).toBeNull());
  },
};

export const SemSeta: Story = {
  args: {
    content: "Briefing",
    showArrow: false,
    triggerLabel: "Informações sobre Briefing",
  },
  name: "Sem seta",
};
