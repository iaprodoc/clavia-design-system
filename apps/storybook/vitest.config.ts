import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * A concorrência é limitada de propósito. Em modo browser, o vitest dimensiona
 * os workers pelo número de CPUs — em uma máquina de 72 núcleos isso abre
 * contextos de chromium suficientes para derrubar a página no meio da suíte
 * ("Browser connection was closed while running tests"), e a story sorteada
 * varia a cada execução — três execuções seguidas quebraram em SaveStatus,
 * Tabs e HubConversationInspection, sem nenhuma delas falhar isolada.
 * Um teto fixo torna o resultado igual em qualquer máquina. Serializar
 * (fileParallelism: false) também resolve, mas a suíte passa de 40 min.
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: ".storybook",
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright({
              launchOptions: {
                // /dev/shm é pequeno em container; sem isso o chromium
                // fica sem memória compartilhada e cai.
                args: ["--disable-dev-shm-usage"],
              },
            }),
          },
          // Teto fixo: sem ele o vitest dimensiona pelos núcleos da máquina.
          maxWorkers: 4,
          name: "storybook",
        },
      },
    ],
  },
});
