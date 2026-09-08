import {
  Button,
  Field,
  Input,
  PageHeader,
  Progress,
  SaveStatus,
  Section,
  Stepper,
  StickyActionBar,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";

import "./app-journey.css";

const phases = [
  { id: "configuracao", label: "Configuração", number: 1 },
  { id: "briefing", label: "Briefing", number: 2 },
  { id: "ativacao", label: "Ativação", number: 3 },
] as const;

const phaseContent: Record<
  (typeof phases)[number]["id"],
  {
    description: string;
    fields: readonly { helpTooltip: string; label: string; value: string }[];
    sectionDescription: string;
    sectionTitle: string;
    title: string;
  }
> = {
  configuracao: {
    description: "Defina as informações que orientam a primeira experiência da clínica.",
    fields: [
      {
        helpTooltip: "Use um nome claro para a equipe reconhecer este projeto.",
        label: "Nome do projeto",
        value: "Clínica Horizonte",
      },
      {
        helpTooltip: "Esse nome aparece como referência durante a jornada.",
        label: "Nome da clínica",
        value: "Clínica Horizonte",
      },
    ],
    sectionDescription: "Comece pelos dados que dão contexto à jornada do time.",
    sectionTitle: "Informações iniciais",
    title: "Configure seu projeto",
  },
  briefing: {
    description: "Revise os dados e escolha o melhor horário para a conversa de alinhamento.",
    fields: [
      {
        helpTooltip: "Registre uma referência curta para orientar a conversa.",
        label: "Ponto de partida",
        value: "Organizar o início da operação",
      },
      {
        helpTooltip: "A disponibilidade final continua sob responsabilidade do produto.",
        label: "Melhor horário para conversar",
        value: "Segundas-feiras, às 14h",
      },
    ],
    sectionDescription: "Reúna o contexto necessário antes de confirmar o alinhamento.",
    sectionTitle: "Preparação do briefing",
    title: "Prepare o briefing",
  },
  ativacao: {
    description: "Confirme os últimos detalhes antes de disponibilizar a operação para o time.",
    fields: [
      {
        helpTooltip: "Mantenha uma pessoa de referência para os próximos passos.",
        label: "Responsável pela ativação",
        value: "Ana Martins",
      },
      {
        helpTooltip: "A data é apenas uma referência visual nesta composição.",
        label: "Próxima revisão",
        value: "15 de setembro de 2026",
      },
    ],
    sectionDescription: "Confira os responsáveis e o próximo ponto de acompanhamento.",
    sectionTitle: "Revisão final",
    title: "Ative a operação",
  },
};

function AppJourney() {
  const [currentId, setCurrentId] = useState<(typeof phases)[number]["id"]>("configuracao");
  const currentIndex = phases.findIndex((phase) => phase.id === currentId);
  const currentPhase = phaseContent[currentId];
  const canContinue = currentIndex < phases.length - 1;
  const previousPhase = phases[currentIndex - 1];

  const moveToPreviousPhase = () => {
    if (previousPhase) {
      setCurrentId(previousPhase.id);
    }
  };

  const moveToNextPhase = () => {
    const nextPhase = phases[currentIndex + 1];

    if (nextPhase) {
      setCurrentId(nextPhase.id);
    }
  };

  return (
    <main className="clv-app-journey">
      <aside className="clv-app-journey__navigation">
        <Stepper
          label="Fases da jornada"
          onStepChange={(phase) => setCurrentId(phase.id as (typeof phases)[number]["id"])}
          progress={(currentIndex + 1) * 33}
          steps={phases.map((phase, index) => ({
            ...phase,
            status:
              index < currentIndex
                ? ("completed" as const)
                : index === currentIndex
                  ? ("current" as const)
                  : ("available" as const),
          }))}
        />
      </aside>
      <section className="clv-app-journey__content">
        <PageHeader
          description={currentPhase.description}
          eyebrow={`Fase ${currentIndex + 1} de ${phases.length}`}
          title={currentPhase.title}
        />
        <div className="clv-app-journey__progress">
          <Progress label="Progresso da jornada" value={(currentIndex + 1) * 33} />
        </div>
        <div className="clv-app-journey__workspace" key={currentId}>
          <Section description={currentPhase.sectionDescription} title={currentPhase.sectionTitle}>
            <div className="clv-app-journey__field-grid">
              {currentPhase.fields.map((field, index) => {
                const fieldId = `app-journey-${currentId}-${index}`;

                return (
                  <Field
                    helpTooltip={field.helpTooltip}
                    id={fieldId}
                    key={fieldId}
                    label={field.label}
                    motion="none"
                  >
                    <Input defaultValue={field.value} />
                  </Field>
                );
              })}
            </div>
          </Section>
        </div>
        <StickyActionBar
          previousAction={
            previousPhase ? (
              <Button onClick={moveToPreviousPhase} variant="secondary">
                Voltar
              </Button>
            ) : undefined
          }
          primaryAction={
            <Button disabled={!canContinue} onClick={moveToNextPhase}>
              Continuar
            </Button>
          }
          status={<SaveStatus lastSavedAt="09:12" status="saved" />}
        />
      </section>
    </main>
  );
}

const meta = {
  component: AppJourney,
  parameters: {
    docs: {
      description: {
        component:
          "Composição de referência para a jornada do App. Coordena navegação, contexto, progresso e ação principal; dados, validação e integrações continuam no produto.",
      },
    },
    layout: "fullscreen",
  },
  title: "Composições/App/Jornada guiada",
} satisfies Meta<typeof AppJourney>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Interacoes: Story = {
  ...Padrao,
  name: "Interações críticas",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Configure seu projeto" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Nome do projeto" })).toHaveValue(
      "Clínica Horizonte",
    );
    await userEvent.click(canvas.getByRole("button", { name: /Briefing/ }));
    await expect(canvas.getByRole("heading", { name: "Prepare o briefing" })).toBeVisible();
    await expect(canvas.getByRole("progressbar", { name: "Progresso da jornada" })).toHaveAttribute(
      "aria-valuenow",
      "66",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Continuar" }));
    await expect(canvas.getByRole("heading", { name: "Ative a operação" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Voltar" }));
    await expect(canvas.getByRole("heading", { name: "Prepare o briefing" })).toBeVisible();
  },
};
