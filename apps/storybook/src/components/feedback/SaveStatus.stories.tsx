import { SaveStatus } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  args: {
    status: "saving",
  },
  component: SaveStatus,
  parameters: {
    docs: {
      description: {
        component:
          "Comunica salvamento em andamento, concluído ou com falha. Somente enquanto salva, o ponto central emite duas ondas alternadas; confirmação e erro ficam estáticos. Com movimento reduzido, todos os estados permanecem estáticos e continuam compreensíveis por texto. Nunca exiba confirmação quando a operação falhar; ofereça nova tentativa quando ela puder ser executada no mesmo contexto. Dentro do `StickyActionBar`, a cor é definida pelo `tone` da dock: `on-dark` usa verde claro para sucesso, vermelho claro para erro e texto claro durante o salvamento. Não sobrescreva essas cores no fluxo.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/SaveStatus",
} satisfies Meta<typeof SaveStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectRadar(canvasElement: HTMLElement) {
  const mark = canvasElement.querySelector<HTMLElement>(".clv-save-status__mark");

  if (!mark) {
    throw new Error("Indicador de salvamento não encontrado.");
  }

  const radarWave = getComputedStyle(mark, "::before");

  await expect(radarWave.animationName).toBe("clv-save-status-radar");
  await expect(radarWave.animationDuration).toBe("1.6s");
  await expect(radarWave.borderColor).toBe(getComputedStyle(mark).color);
}

async function expectStaticMark(canvasElement: HTMLElement) {
  const mark = canvasElement.querySelector<HTMLElement>(".clv-save-status__mark");

  if (!mark) {
    throw new Error("Indicador de salvamento não encontrado.");
  }

  await expect(getComputedStyle(mark, "::before").animationName).toBe("none");
}

export const Salvando: Story = {
  play: async ({ canvasElement }) => expectRadar(canvasElement),
};

export const Salvo: Story = {
  args: { lastSavedAt: "10:42", status: "saved" },
  play: async ({ canvasElement }) => expectStaticMark(canvasElement),
};

export const Erro: Story = {
  args: { onRetry: () => undefined, status: "error" },
  play: async ({ canvasElement }) => expectStaticMark(canvasElement),
};
