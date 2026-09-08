import { BuildingIcon, CalendarClockIcon, CalendarSyncIcon, TargetIcon } from "@clavia-ds/icons";
import { StepCard } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = {
  args: {
    description: "Informações básicas, horários, serviços e profissionais",
    leadingIcon: <BuildingIcon />,
    number: 1,
    onClick: fn(),
    status: "completed",
    title: "Sobre a Clínica",
  },
  component: StepCard,
  decorators: [
    (Story) => (
      <div className="clv-story-step-card-stack">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Destino de navegação ou resumo destacado de uma etapa do onboarding. O leadingIcon identifica a etapa e permanece o mesmo em todos os estados; etapas concluídas exibem o badge Concluída, e número e status permanecem disponíveis para tecnologias assistivas. O hover usa a elevação raised do componente para sinalizar acionamento; o foco permanece independente. Forneça onClick somente quando houver uma ação real; não use o card como recipiente genérico de conteúdo.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Progresso/StepCard",
} satisfies Meta<typeof StepCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Concluida: Story = {
  name: "Concluída",
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button", { name: /Sobre a Clínica/ });
    const accessibleStatus = canvas.getByText("Etapa 1. Status: Concluída.");
    const indicator = canvasElement.querySelector<HTMLElement>(".clv-step-card__indicator");

    await expect(getComputedStyle(card).borderRadius).toBe("16px");
    await expect(getComputedStyle(card).boxShadow).toBe("none");
    await expect(getComputedStyle(card).zIndex).toBe("0");
    await expect(accessibleStatus).toHaveClass("clv-sr-only");
    await expect(canvas.getByText("Concluída").closest(".clv-status-badge")).not.toBeNull();
    await expect(indicator).not.toBeNull();
    if (indicator) {
      await expect(getComputedStyle(indicator).borderRadius).toBe("16px");
      await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(212, 239, 222)");
      await expect(getComputedStyle(indicator).color).toBe("rgb(23, 107, 58)");
    }
    await userEvent.tab();
    await expect(card).toHaveFocus();
    await expect(getComputedStyle(card).zIndex).toBe("1");
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Atual: Story = {
  args: {
    description: "Defina como a clínica orienta o atendimento comercial.",
    leadingIcon: <TargetIcon />,
    number: 3,
    status: "current",
    title: "Processo Comercial",
  },
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector<HTMLElement>(".clv-step-card__indicator");

    await expect(indicator).not.toBeNull();
    if (indicator) {
      await expect(getComputedStyle(indicator).backgroundColor).toBe("rgb(34, 78, 130)");
      await expect(getComputedStyle(indicator).color).toBe("rgb(255, 255, 255)");
    }
  },
};

export const Disponivel: Story = {
  name: "Disponível",
  args: {
    description: "Revise os dados antes de avançar para o briefing.",
    leadingIcon: <CalendarClockIcon />,
    number: 4,
    status: "available",
    title: "Agendar Briefing",
  },
};

export const Bloqueada: Story = {
  args: {
    description: "Esta etapa fica disponível quando a configuração da clínica estiver pronta.",
    leadingIcon: <CalendarSyncIcon />,
    number: 7,
    disabled: true,
    status: "blocked",
    title: "Compartilhar Agenda",
  },
};

export const TodosOsEstados: Story = {
  name: "Todos os estados",
  render: () => (
    <div className="clv-story-stack clv-story-step-card-stack">
      <StepCard
        description="Informações básicas, horários, serviços e profissionais"
        leadingIcon={<BuildingIcon />}
        number={1}
        onClick={() => undefined}
        status="completed"
        title="Sobre a Clínica"
      />
      <StepCard
        description="Defina como a clínica orienta o atendimento comercial."
        leadingIcon={<TargetIcon />}
        number={3}
        onClick={() => undefined}
        status="current"
        title="Processo Comercial"
      />
      <StepCard
        description="Revise os dados antes de avançar para o briefing."
        leadingIcon={<CalendarClockIcon />}
        number={4}
        onClick={() => undefined}
        status="available"
        title="Agendar Briefing"
      />
      <StepCard
        description="Esta etapa fica disponível quando a configuração da clínica estiver pronta."
        leadingIcon={<CalendarSyncIcon />}
        number={7}
        onClick={() => undefined}
        status="blocked"
        title="Compartilhar Agenda"
      />
    </div>
  ),
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
