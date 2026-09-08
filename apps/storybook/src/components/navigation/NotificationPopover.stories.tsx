import { NotificationPopover } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { hubNotificationItems } from "./notification-fixtures";

const meta = {
  component: NotificationPopover,
  parameters: {
    docs: {
      description: {
        component:
          "Use NotificationPopover no cabeçalho para atualizações persistentes que a pessoa pode consultar depois. A ação compacta de double-check marca todas como lidas e preserva um nome acessível. O produto fornece os dados, controla o estado de leitura e executa navegação ou persistência pelos callbacks. Use Toast para retornos transitórios de uma ação e não transforme este componente em um histórico completo de atividades.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Navegação/NotificationPopover",
} satisfies Meta<typeof NotificationPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    items: hubNotificationItems,
    onMarkAllAsRead: fn(),
    onViewAll: fn(),
  },
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Ver notificações" });

    await expect(trigger.querySelector("svg")).toHaveAttribute("data-icon-weight", "regular");
    await expect(trigger.querySelector(".clv-notification-popover__indicator")).not.toBeNull();
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole("dialog", { name: "Notificações" })).toBeVisible();
    await expect(body.getByText("2 não lidas")).toBeVisible();
    await expect(body.getByText("Integração interrompida")).toBeVisible();
    await expect(body.getByText("Relatório semanal concluído")).toBeVisible();
    await expect(body.getByText("Novo acesso aprovado")).toBeVisible();
    const markAllAsRead = body.getByRole("button", { name: "Marcar todas como lidas" });
    await expect(markAllAsRead.querySelector("svg")).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Aberto: Story = {
  args: {
    ...Padrao.args,
    defaultOpen: true,
  },
};

export const Vazio: Story = {
  args: {
    defaultOpen: true,
    items: [],
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText("Nenhuma notificação")).toBeVisible();
    await expect(body.getByText("Novas atualizações aparecerão aqui.")).toBeVisible();
  },
};
