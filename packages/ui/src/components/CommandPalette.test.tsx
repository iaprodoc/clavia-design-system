import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CommandPalette } from "./CommandPalette";

const actions = [
  { description: "Encontre projetos por nome ou responsável.", id: "projects", label: "Projetos" },
  { id: "settings", keywords: ["configuração"], label: "Configurações" },
] as const;

describe("CommandPalette", () => {
  it("filtra ações e comunica a escolha ao produto", () => {
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette
        items={[...actions, { id: "users", label: "Usuários", onAction }]}
        onOpenChange={onOpenChange}
        trigger="Busca rápida"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Busca rápida" }));
    const search = screen.getByRole("searchbox", { name: "Busca rápida" });
    fireEvent.change(search, { target: { value: "usu" } });
    fireEvent.click(screen.getByRole("option", { name: "Usuários" }));

    expect(onAction).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("mostra uma mensagem textual sem resultados", () => {
    render(<CommandPalette defaultOpen items={actions} trigger="Busca rápida" />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Busca rápida" }), {
      target: { value: "financeiro" },
    });

    expect(screen.getByText("Nenhuma ação encontrada.")).toBeVisible();
  });

  it("publica o gatilho compacto para uso em topbars", () => {
    render(
      <CommandPalette items={actions} trigger="Digite para buscar..." triggerVariant="compact" />,
    );

    const trigger = screen.getByRole("button", { name: "Digite para buscar..." });

    expect(trigger).toHaveClass(
      "clv-command-palette__trigger",
      "clv-command-palette__trigger--compact",
    );
    expect(trigger).toHaveAttribute("data-trigger-variant", "compact");
  });
});
