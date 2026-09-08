import { ClaviaProductLockup } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import "./product-lockup.css";

const meta = {
  title: "Visão geral/Marca/Assinatura de solução",
  component: ClaviaProductLockup,
  tags: ["autodocs"],
  args: {
    solution: "Hub",
    tone: "primary",
    wordmarkWidth: 88,
  },
  argTypes: {
    solution: {
      control: "text",
      description: "Uma única palavra curta que identifica a solução.",
    },
    tone: {
      control: "inline-radio",
      options: ["primary", "secondary", "support", "inverse"],
    },
    wordmarkWidth: {
      control: { step: 1, type: "number" },
      description: "Largura do wordmark; o nome acompanha a escala funcional da assinatura.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Assinatura funcional que combina o wordmark oficial da Clavia com o nome curto de uma solução. O azul-marinho principal da marca é o tom padrão; Hub e App são as referências aprovadas. Para uma solução futura, use uma única palavra curta, sem quebra de linha, mantendo a grafia institucional e o mesmo peso visual. Se o nome precisar de duas palavras, abreviação forçada ou competir em largura com o wordmark, use Clavia sozinha e apresente o nome como título contextual. O componente não altera o vetor oficial nem cria uma nova versão do logo.",
      },
    },
  },
} satisfies Meta<typeof ClaviaProductLockup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Hub: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Assinatura do ambiente operacional. É a versão usada na navegação expandida do Clavia Hub; quando a sidebar recolhe, a redução oficial substitui a assinatura completa.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lockup = canvas.getByRole("img", { name: "Clavia Hub" });
    const wordmark = lockup.querySelector<SVGElement>(".clv-logo");
    const solution = lockup.querySelector<HTMLElement>(".clv-product-lockup__solution");

    await expect(wordmark).toHaveAttribute("aria-hidden", "true");
    await expect(wordmark).toHaveAttribute("width", "88");
    await expect(solution).toHaveTextContent("Hub");
    await expect(getComputedStyle(lockup).alignItems).toBe("center");
    await expect(getComputedStyle(lockup).gap).toBe("8px");
  },
};

export const App: Story = {
  args: {
    solution: "App",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Assinatura do produto voltado aos clientes da Clavia. A construção é idêntica à do Hub; muda apenas o nome curto da solução.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("img", { name: "Clavia App" })).toBeVisible();
  },
};

export const FamiliaDeSolucoes: Story = {
  name: "Família de soluções",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Hub e App compartilham a mesma anatomia: wordmark preservado, intervalo constante e nome funcional em Sora Medium. A API aceita futuros nomes curtos sem exigir um novo arquivo de logo.",
      },
    },
  },
  render: () => (
    <section aria-label="Assinaturas das soluções Clavia" className="clv-story-product-lockups">
      <figure>
        <ClaviaProductLockup solution="Hub" />
        <figcaption>Operação interna</figcaption>
      </figure>
      <figure>
        <ClaviaProductLockup solution="App" />
        <figcaption>Produto para clientes</figcaption>
      </figure>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("img", { name: "Clavia Hub" })).toBeVisible();
    await expect(canvas.getByRole("img", { name: "Clavia App" })).toBeVisible();
  },
};
