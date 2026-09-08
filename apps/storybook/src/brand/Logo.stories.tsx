import { ClaviaLogo, type ClaviaLogoTone } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  title: "Visão geral/Marca/Logo",
  component: ClaviaLogo,
  tags: ["autodocs"],
  args: {
    lockup: "wordmark",
    tone: "primary",
    width: 266,
  },
  argTypes: {
    lockup: {
      control: "inline-radio",
      options: ["wordmark", "tagline"],
    },
    tone: {
      control: "inline-radio",
      options: ["primary", "secondary", "support", "inverse"],
    },
    width: {
      control: { step: 1, type: "number" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Assinatura vetorial oficial da Clavia. O componente preserva a proporção dos SVGs entregues e oferece apenas as quatro cores existentes nos arquivos de marca. Use a versão sem tagline como padrão funcional. O tamanho é definido pelo contexto de navegação e pela legibilidade, sem um mínimo universal imposto pelo componente. A área de proteção deve ser garantida pelo layout ao redor; não estique, rotacione, aplique sombra, profundidade, transparência ou cores arbitrárias.",
      },
    },
  },
} satisfies Meta<typeof ClaviaLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AssinaturaPrincipal: Story = {
  name: "Assinatura principal",
  parameters: {
    docs: {
      description: {
        story:
          "Versão preferencial para cabeçalhos, acesso e superfícies claras com espaço horizontal suficiente.",
      },
    },
  },
};

export const ComTagline: Story = {
  name: "Com tagline",
  args: {
    lockup: "tagline",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Assinatura institucional com a tagline Inteligência Comercial convertida em vetor. Ela permanece disponível para contextos de marca; o produto continua usando a versão sem tagline como padrão até que o uso fixo da frase seja aprovado.",
      },
    },
  },
};

const approvedTones: Array<{
  background: "light" | "dark" | "gradient";
  label: string;
  tone: ClaviaLogoTone;
}> = [
  { background: "light", label: "Principal · #021826", tone: "primary" },
  { background: "light", label: "Secundária · #224E82", tone: "secondary" },
  { background: "dark", label: "Apoio · #EFEEED", tone: "support" },
  { background: "dark", label: "Reversa · branco", tone: "inverse" },
  { background: "gradient", label: "Reversa · gradiente de marca", tone: "inverse" },
];

export const CoresAprovadas: Story = {
  name: "Cores aprovadas",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "As quatro variações correspondem aos arquivos oficiais entregues. A versão reversa também pode ser aplicada sobre o gradiente de marca, que funciona apenas como superfície de fundo. A escolha depende do contraste; não misture tons dentro da assinatura e não crie novas cores.",
      },
    },
  },
  render: () => (
    <section aria-label="Variações oficiais do logo" className="clv-story-logo-grid">
      {approvedTones.map(({ background, label, tone }) => (
        <figure className="clv-story-logo-item" key={`${background}-${tone}`}>
          <div className={`clv-story-logo-sample clv-story-logo-sample--${background}`}>
            <ClaviaLogo aria-label={`Clavia, versão ${label}`} tone={tone} width={200} />
          </div>
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectedColors = [
      "rgb(2, 24, 38)",
      "rgb(34, 78, 130)",
      "rgb(239, 238, 237)",
      "rgb(255, 255, 255)",
      "rgb(255, 255, 255)",
    ];
    const logos = canvas.getAllByRole("img");
    const items = canvasElement.querySelectorAll<HTMLElement>(".clv-story-logo-item");
    const samples = canvasElement.querySelectorAll<HTMLElement>(".clv-story-logo-sample");
    const labels = canvasElement.querySelectorAll<HTMLElement>(".clv-story-logo-item figcaption");

    await expect(logos).toHaveLength(5);
    await expect(items).toHaveLength(5);
    await expect(samples).toHaveLength(5);
    await expect(labels).toHaveLength(5);

    for (const [index, logo] of logos.entries()) {
      await expect(getComputedStyle(logo).color).toBe(expectedColors[index]);
      await expect(logo).toHaveAttribute("viewBox", "0 0 266 79");
      await expect(logo).toHaveAttribute("width", "200");
    }

    for (const [index, sample] of samples.entries()) {
      const sampleStyles = getComputedStyle(sample);
      const sampleRect = sample.getBoundingClientRect();
      const logoRect = sample.querySelector(".clv-logo")?.getBoundingClientRect();
      const label = labels[index];

      if (!label) {
        throw new Error("Anotação da assinatura não encontrada.");
      }

      await expect(sampleStyles.paddingBlockStart).toBe("32px");
      await expect(sampleStyles.paddingBlockEnd).toBe("32px");
      await expect(sampleStyles.paddingInlineStart).toBe("32px");
      await expect(sampleStyles.paddingInlineEnd).toBe("32px");
      await expect(sampleStyles.alignContent).toBe("center");
      await expect(logoRect).toBeDefined();
      await expect(sample.contains(label)).toBe(false);
      await expect(sample.nextElementSibling).toBe(label);

      if (logoRect) {
        const sampleCenter = sampleRect.left + sampleRect.width / 2;
        const logoCenter = logoRect.left + logoRect.width / 2;

        await expect(Math.abs(sampleCenter - logoCenter)).toBeLessThan(1);
      }
    }

    for (const label of labels) {
      await expect(getComputedStyle(label).fontWeight).toBe("300");
    }
  },
};
