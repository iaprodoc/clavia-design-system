import { SearchIcon } from "@clavia-ds/icons";
import { CommandPalette } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

const actions = [
  {
    description: "Acompanhe a carteira e os próximos passos.",
    id: "projects",
    keywords: ["carteira", "projetos"],
    label: "Abrir projetos",
    shortcut: "G P",
  },
  {
    description: "Revise conexões que exigem atenção.",
    id: "integrations",
    keywords: ["whatsapp", "conexões"],
    label: "Ver integrações",
    shortcut: "G I",
  },
  {
    id: "settings",
    keywords: ["configuração"],
    label: "Abrir configurações",
  },
  {
    description: "Aguardando a permissão do produto.",
    id: "billing",
    isDisabled: true,
    label: "Abrir faturamento",
  },
] as const;

const meta = {
  args: { items: actions, trigger: "Busca rápida" },
  component: CommandPalette,
  parameters: {
    docs: {
      description: {
        component:
          "Use para localizar rapidamente destinos e ações já conhecidos da operação. O gatilho padrão possui contorno; a variante compact serve a topbars e oferece feedback de hover com superfície semântica. Não substitui a busca por registros, filtros persistentes nem regras de permissão do produto.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Dados/CommandPalette",
} satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BuscaRapida: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Busca rápida" }));
    const page = within(canvasElement.ownerDocument.body);
    const input = page.getByRole("searchbox", { name: "Busca rápida" });
    await userEvent.type(input, "integra");
    await expect(page.getByRole("option", { name: /Ver integrações/ })).toBeVisible();

    const overlay = canvasElement.ownerDocument.querySelector(".clv-command-palette__overlay");
    const search = canvasElement.ownerDocument.querySelector(".clv-command-palette__search");
    await expect(overlay).not.toBeNull();
    await expect(search).not.toBeNull();
    await expect(getComputedStyle(overlay as Element).paddingInline).toBe("16px");
    await expect(getComputedStyle(overlay as Element).zIndex).toBe("50");
    await expect(getComputedStyle(overlay as Element).fontFamily).toContain("Sora");
    await expect(getComputedStyle(search as Element).gap).toBe("8px");
    await expect(getComputedStyle(search as Element).borderRadius).toBe("0px");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.getByRole("button", { name: "Busca rápida" })).toHaveFocus());
  },
};

export const GatilhoCompacto: Story = {
  args: {
    trigger: (
      <>
        <SearchIcon aria-hidden="true" />
        <span>Digite para buscar...</span>
      </>
    ),
    triggerVariant: "compact",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Gatilho compacto para cabeçalhos de produto. Mantém a área de controle, remove o contorno aparente em repouso e usa mudança de superfície e contraste no hover.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Digite para buscar..." });

    await expect(trigger).toHaveAttribute("data-trigger-variant", "compact");
    await expect(getComputedStyle(trigger).minBlockSize).toBe("36px");
    await userEvent.hover(trigger);
    await waitFor(() =>
      expect(getComputedStyle(trigger).backgroundColor).toBe("rgb(234, 241, 248)"),
    );
    await waitFor(() => expect(getComputedStyle(trigger).color).toBe("rgb(2, 24, 38)"));
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
  },
};

export const SemResultados: Story = {
  args: { defaultOpen: true, items: actions, trigger: "Busca rápida" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.type(page.getByRole("searchbox", { name: "Busca rápida" }), "financeiro");
    await expect(page.getByText("Nenhuma ação encontrada.")).toBeVisible();
  },
};

export const ItemDesabilitado: Story = {
  args: { defaultOpen: true, items: actions, trigger: "Busca rápida" },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const search = page.getByRole("searchbox", { name: "Busca rápida" });
    const item = page.getByRole("option", { name: /Abrir faturamento/ });

    await expect(item).toHaveAttribute("aria-disabled", "true");
    await expect(getComputedStyle(item).color).not.toBe("rgba(0, 0, 0, 0)");

    if (!window.matchMedia("(forced-colors: active)").matches) {
      await expect(getComputedStyle(item).color).toBe("rgb(101, 116, 124)");
    }

    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard("{Tab}");
    await expect(page.getByRole("option", { name: /Abrir projetos/ })).toHaveFocus();
  },
};
