import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NotificationPopover, type NotificationPopoverItem } from "./NotificationPopover";

const items: NotificationPopoverItem[] = [
  {
    description: "A Clínica Aurora parou de receber eventos.",
    id: "integration",
    isUnread: true,
    time: "Há 18 min",
    title: "Integração interrompida",
    tone: "warning",
  },
  {
    description: "O resumo de desempenho está pronto para consulta.",
    id: "report",
    isUnread: true,
    time: "Há 1 h",
    title: "Relatório semanal concluído",
    tone: "success",
  },
];

describe("NotificationPopover", () => {
  it("abre a central com contagem, lista e estado não lido nomeados", () => {
    render(<NotificationPopover items={items} />);
    const trigger = screen.getByRole("button", { name: "Ver notificações" });

    expect(trigger.querySelector(".clv-notification-popover__indicator")).toBeInTheDocument();
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Notificações" })).toBeVisible();
    expect(screen.getByRole("list", { name: "Notificações recentes" })).toBeVisible();
    expect(screen.getByText("2 não lidas")).toBeVisible();
    expect(screen.getByText("Integração interrompida")).toBeVisible();
    expect(screen.getAllByText("Não lida")).toHaveLength(2);
  });

  it("mostra o estado vazio e remove o indicador do gatilho", () => {
    const { container } = render(<NotificationPopover defaultOpen items={[]} />);

    expect(screen.getByText("Nenhuma notificação")).toBeVisible();
    expect(screen.getByText("Novas atualizações aparecerão aqui.")).toBeVisible();
    expect(container.querySelector(".clv-notification-popover__indicator")).not.toBeInTheDocument();
  });

  it("encaminha ações dos itens e da central ao produto", () => {
    const onItemAction = vi.fn();
    const onMarkAllAsRead = vi.fn();
    const onViewAll = vi.fn();
    const actionableItem: NotificationPopoverItem = {
      description: "A Clínica Aurora parou de receber eventos.",
      id: "integration",
      isUnread: true,
      onAction: onItemAction,
      time: "Há 18 min",
      title: "Integração interrompida",
      tone: "warning",
    };
    render(
      <NotificationPopover
        defaultOpen
        items={[actionableItem]}
        onMarkAllAsRead={onMarkAllAsRead}
        onViewAll={onViewAll}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Integração interrompida/ }));
    const markAllAsReadButton = screen.getByRole("button", { name: "Marcar todas como lidas" });
    expect(markAllAsReadButton.querySelector("svg")).toHaveAttribute(
      "data-icon-source",
      "phosphor",
    );
    fireEvent.click(markAllAsReadButton);
    fireEvent.click(screen.getByRole("button", { name: "Ver todas as notificações" }));

    expect(onItemAction).toHaveBeenCalledOnce();
    expect(onMarkAllAsRead).toHaveBeenCalledOnce();
    expect(onViewAll).toHaveBeenCalledOnce();
  });
});
