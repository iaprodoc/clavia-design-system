import { CalendarClockIcon, CheckIcon, FileTextIcon, GridIcon, TargetIcon } from "@clavia-ds/icons";
import { Stepper } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

const onboardingPhases = [
  {
    id: "formularios",
    label: "Formulários",
    number: <FileTextIcon />,
    status: "current",
  },
  {
    id: "briefing",
    label: "Briefing",
    number: <CalendarClockIcon />,
    status: "blocked",
  },
  {
    id: "implementacao",
    label: "Implementação",
    number: <GridIcon />,
    status: "blocked",
  },
  {
    id: "testes",
    label: "Testes",
    number: <TargetIcon />,
    status: "blocked",
  },
  {
    id: "ativacao",
    label: "Ativação",
    number: <CheckIcon />,
    status: "blocked",
  },
] as const;

const compactPhaseNavigation = onboardingPhases.map((phase, index) => ({
  ...phase,
  number: index === 0 ? <CheckIcon /> : index + 1,
  status:
    index === 0
      ? ("completed" as const)
      : index === 1
        ? ("current" as const)
        : ("blocked" as const),
}));

const meta = {
  args: {
    label: "Fases do onboarding",
    progress: 60,
    showStatus: false,
    steps: onboardingPhases,
  },
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component:
          "Sequência de etapas com ícone contextual e título visíveis. Os estados continuam disponíveis para tecnologias assistivas. Use a orientação horizontal apenas em sequências curtas e áreas largas; títulos longos e telas menores pedem a orientação vertical. A variante `phase-navigation` documenta uma barra compacta para as fases macro do onboarding mobile.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Progresso/Stepper",
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectCurrentVisualState(canvasElement: HTMLElement) {
  const stepper = canvasElement.querySelector<HTMLElement>(".clv-stepper");
  const currentStep = canvasElement.querySelector<HTMLElement>('[data-status="current"]');
  const pendingStep = canvasElement.querySelector<HTMLElement>('[data-status="blocked"]');
  const content = currentStep?.querySelector<HTMLElement>(".clv-step-progress-indicator__content");
  const outline = currentStep?.querySelector<SVGCircleElement>(
    ".clv-step-progress-indicator__outline",
  );
  const pendingIndicator = pendingStep?.querySelector<HTMLElement>(".clv-stepper__indicator");

  await expect(currentStep).not.toBeNull();
  await expect(stepper).not.toBeNull();
  await expect(pendingStep).not.toBeNull();
  await expect(content).not.toBeNull();
  await expect(outline).not.toBeNull();
  await expect(pendingIndicator).not.toBeNull();

  if (stepper) {
    await expect(stepper.tabIndex).toBe(-1);
  }

  if (currentStep && content && outline) {
    await expect(getComputedStyle(content).backgroundColor).toBe("rgb(34, 78, 130)");
    await expect(getComputedStyle(content).color).toBe("rgb(255, 255, 255)");
    await expect(getComputedStyle(outline).stroke).toBe("rgb(86, 178, 237)");
    await expect(getComputedStyle(currentStep, "::after").backgroundColor).toBe(
      "rgb(86, 178, 237)",
    );
  }

  if (pendingStep && pendingIndicator) {
    const connectorStyle = getComputedStyle(pendingStep, "::after");
    const indicatorBorderColor = getComputedStyle(pendingIndicator).borderColor;

    await expect(indicatorBorderColor).toContain("/ 0.52");
    await expect(connectorStyle.backgroundColor).toContain("/ 0.52");
    await expect(
      stepper?.dataset.orientation === "horizontal" ? connectorStyle.height : connectorStyle.width,
    ).toBe("3px");
  }
}

export const Vertical: Story = {
  play: async ({ canvasElement }) => expectCurrentVisualState(canvasElement),
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  decorators: [
    (Story) => (
      <div className="clv-story-stepper-stack">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => expectCurrentVisualState(canvasElement),
};

export const NavegacaoDeFasesCompacta: Story = {
  args: {
    orientation: "horizontal",
    steps: compactPhaseNavigation,
    variant: "phase-navigation",
  },
  render: ({ progress: _progress, ...args }) => <Stepper {...args} />,
  decorators: [
    (Story) => (
      <div className="clv-story-stepper-stack">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Use esta variante para apresentar até cinco fases macro no topo do onboarding mobile. Combine `variant="phase-navigation"`, `orientation="horizontal"`, `size="compact"` e `showStatus={false}`. A fase atual exibe número, aro azul e nome; as concluídas exibem check; as bloqueadas preservam o número. O estado e o nome de cada fase continuam disponíveis para tecnologias assistivas, e a fase atual recebe `aria-current="step"`. Não use esta variante para as etapas internas do formulário, fluxos longos ou quando todos os rótulos precisarem ficar visíveis. A pulsação do aro é uma decisão local do cabeçalho mobile do onboarding e respeita `prefers-reduced-motion`; ela não faz parte do contrato do `Stepper`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const stepper = canvasElement.querySelector<HTMLElement>(".clv-stepper");
    const completedIcon = canvasElement.querySelector<SVGElement>(
      '[data-status="completed"] .clv-stepper__indicator-value svg',
    );
    const currentContent = canvasElement.querySelector<HTMLElement>(
      '[aria-current="step"] .clv-stepper__content',
    );

    await expect(stepper).toHaveAttribute("data-variant", "phase-navigation");
    await expect(completedIcon).not.toBeNull();
    await expect(currentContent).not.toBeNull();
  },
};

export const Navegavel: Story = {
  args: {
    onStepChange: fn(),
    orientation: "horizontal",
    steps: compactPhaseNavigation.map((phase, index) => ({
      ...phase,
      status: index === 2 ? ("available" as const) : phase.status,
    })),
  },
  decorators: [
    (Story) => (
      <div className="clv-story-stepper-stack">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Forneça `onStepChange` para transformar as etapas não bloqueadas em botões. Tab, Enter e Espaço seguem o comportamento nativo; as setas e Home/End movem o foco entre as etapas disponíveis. Etapas bloqueadas continuam somente informativas.",
      },
    },
  },
  play: async ({ args, canvas }) => {
    const controls = await canvas.findAllByRole("button");
    const currentControl = controls[1];

    await expect(controls).toHaveLength(3);
    if (!currentControl) {
      throw new Error("A etapa atual navegável não foi renderizada.");
    }
    await userEvent.click(currentControl);
    await expect(args.onStepChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "briefing" }),
    );
  },
};
