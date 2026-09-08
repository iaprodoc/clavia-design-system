import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("abre com papel e nome acessíveis", () => {
    render(
      <Dialog title="Editar clínica" trigger="Editar">
        Conteúdo
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Editar" });
    expect(trigger).toHaveClass(
      "clv-overlay-trigger",
      "clv-button",
      "clv-button--secondary",
      "clv-button--size-md",
    );
    expect(trigger.querySelector("button")).toBeNull();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Editar clínica" });
    expect(dialog).toBeVisible();
    expect(dialog.querySelector(".clv-dialog__header-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeVisible();
    expect(dialog.querySelector(".clv-dialog__actions")).toBeNull();
  });

  it("aplica variante e tamanho Clavia no próprio elemento interativo", () => {
    render(
      <Dialog title="Excluir clínica" trigger="Excluir" triggerSize="xs" triggerVariant="danger" />,
    );

    expect(screen.getByRole("button", { name: "Excluir" })).toHaveClass(
      "clv-button--danger",
      "clv-button--size-xs",
    );
  });

  it("mantém o gatilho controlado acessível sem exibi-lo", () => {
    render(<Dialog title="Confirmação" trigger="Abrir confirmação" triggerHidden />);

    expect(screen.getByRole("button", { name: "Abrir confirmação" })).toHaveClass("clv-sr-only");
  });

  it("mantém confirmação crítica aberta até ação explícita", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        isOpen
        onOpenChange={onOpenChange}
        title="Excluir?"
        trigger="Excluir"
        variant="alert"
      />,
    );
    fireEvent.keyDown(document, { code: "Escape", key: "Escape" });
    expect(screen.getByRole("alertdialog", { name: "Excluir?" })).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("fecha o dialog padrão com Escape e devolve o foco ao disparador", () => {
    render(
      <Dialog title="Editar clínica" trigger="Editar">
        Conteúdo
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Editar" });
    trigger.focus();
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByRole("dialog", { name: "Editar clínica" }), {
      code: "Escape",
      key: "Escape",
    });

    expect(screen.queryByRole("dialog", { name: "Editar clínica" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("separa as ações do dialog padrão em um rodapé com divisor", () => {
    render(
      <Dialog
        actions={<button type="button">Salvar</button>}
        title="Adicionar pessoa"
        trigger="Adicionar"
      >
        Conteúdo
      </Dialog>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    const dialog = screen.getByRole("dialog", { name: "Adicionar pessoa" });

    expect(dialog).toHaveClass("clv-dialog--default");
    expect(dialog.querySelector(".clv-dialog__actions")).toContainElement(
      screen.getByRole("button", { name: "Salvar" }),
    );
  });

  it("associa título e descrição e permite substituir a política de fechamento", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        description="A descrição orienta a decisão."
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen
        onOpenChange={onOpenChange}
        title="Configuração"
        trigger="Abrir configuração"
      />,
    );

    const dialog = screen.getByRole("dialog", { name: "Configuração" });
    expect(dialog).toHaveAccessibleDescription("A descrição orienta a decisão.");
    fireEvent.keyDown(dialog, { code: "Escape", key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
