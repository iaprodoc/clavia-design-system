import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const stories = [
  "../src/overview/**/*.stories.@(ts|tsx)",
  "../src/foundations/**/*.stories.@(ts|tsx)",
  "../src/brand/**/*.stories.@(ts|tsx)",
  "../src/components/**/*.stories.@(ts|tsx)",
  "../src/compositions/AppJourney.stories.tsx",
  "../src/compositions/HubOperationalAnalytics.stories.tsx",
  "../src/compositions/HubConversationInspection.stories.tsx",
  "../src/compositions/HubPeopleAccess.stories.tsx",
];

const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  stories,
  viteFinal: async (baseConfig) =>
    mergeConfig(baseConfig, {
      plugins: [tailwindcss()],
    }),
};

export default config;
