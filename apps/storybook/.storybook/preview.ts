import "@fontsource-variable/instrument-sans/wght.css";
import "@fontsource-variable/sora/wght.css";
import "@clavia-ds/tokens/css";
import "@clavia-ds/ui/styles.css";
import "../src/preview.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  initialGlobals: {
    functionalFont: "sora",
  },
  globalTypes: {
    functionalFont: {
      description: "Fonte funcional aplicada às stories para comparação visual.",
      toolbar: {
        dynamicTitle: true,
        icon: "paragraph",
        items: [
          { title: "Instrument Sans", value: "instrument" },
          { title: "Sora", value: "sora" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const functionalFont =
        context.globals.functionalFont === "instrument" ? "instrument" : "sora";

      if (typeof document !== "undefined") {
        document.documentElement.dataset.clvFunctionalFont = functionalFont;
      }

      return Story();
    },
  ],
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      expanded: true,
    },
    layout: "centered",
    options: {
      storySort: {
        locales: "pt-BR",
        method: "alphabetical",
        order: [
          "Visão geral",
          [
            "Introdução",
            "Fundamentos",
            [
              "Cores",
              "Tipografia",
              "Iconografia",
              "Spacing",
              "Layout",
              "Radius",
              "Border",
              "Elevation",
              "Motion",
              "Focus",
              "Effects",
            ],
            "Marca",
            ["Logo", "Ícone", "Padrões"],
          ],
          "Laboratório",
          [
            "Legado App",
            ["Inventário", "Componentes", "Fluxos"],
            "Legado Hub",
            ["Visão geral", "Componentes", "Fluxos"],
            "QA",
            "Componentes experimentais",
            "Fluxos do App",
          ],
          "Componentes",
          ["Ações", "Formulários", "Feedback", "Progresso", "Navegação", "Layout", "Dados"],
        ],
      },
    },
  },
};

export default preview;
