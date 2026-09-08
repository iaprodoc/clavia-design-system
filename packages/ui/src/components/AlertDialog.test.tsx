import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertDialog } from "./AlertDialog";

describe("AlertDialog", () => {
  it("expõe confirmação crítica e exige uma ação explícita para fechar", () => {
    const onOpenChange = vi.fn();
    render(
      <AlertDialog
        closeButtonLabel="Cancelar exclusão"
        headerIcon={<span data-testid="delete-icon" />}
        isOpen
        onOpenChange={onOpenChange}
        showCloseButton
        title="Excluir projeto?"
        trigger="Excluir"
      >
        Esta ação não pode ser desfeita.
      </AlertDialog>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByRole("button", { hidden: true, name: "Excluir" })).toHaveClass(
      "clv-overlay-trigger",
      "clv-button--secondary",
    );
    expect(screen.getByRole("alertdialog", { name: "Excluir projeto?" })).toHaveTextContent(
      "Esta ação não pode ser desfeita.",
    );
    expect(
      screen.getByTestId("delete-icon").closest(".clv-dialog__header-icon"),
    ).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar exclusão" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("adota ícone de aviso e fechamento visível quando nenhum contexto específico é fornecido", () => {
    render(
      <AlertDialog isOpen title="Revisar publicação?" trigger="Revisar publicação">
        Esta confirmação pede uma decisão explícita.
      </AlertDialog>,
    );

    const alert = screen.getByRole("alertdialog", { name: "Revisar publicação?" });

    expect(alert).toHaveAttribute("data-tone", "warning");
    expect(alert.querySelector(".clv-dialog__header-icon svg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeVisible();
  });
});
