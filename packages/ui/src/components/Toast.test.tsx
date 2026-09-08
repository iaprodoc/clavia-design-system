import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Toast } from "./Toast";

describe("Toast", () => {
  it("anuncia uma confirmação transitória com título e descrição", () => {
    render(
      <Toast description="As alterações estão disponíveis para a equipe." title="Projeto salvo" />,
    );

    expect(screen.getByRole("status", { name: "Projeto salvo" })).toHaveTextContent(
      "As alterações estão disponíveis para a equipe.",
    );
  });

  it("permite dispensar uma notificação quando o produto fornece a ação", () => {
    const onDismiss = vi.fn();
    render(<Toast onDismiss={onDismiss} status="warning" title="Conexão instável" />);

    fireEvent.click(screen.getByRole("button", { name: "Fechar notificação" }));

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(screen.getByRole("alert", { name: "Conexão instável" })).toBeVisible();
  });

  it("aceita uma ação opcional sem alterar o anúncio do toast", () => {
    const onRetry = vi.fn();
    render(
      <Toast
        action={
          <button onClick={onRetry} type="button">
            Tentar novamente
          </button>
        }
        status="danger"
        title="Falha ao salvar"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(onRetry).toHaveBeenCalledOnce();
    expect(screen.getByRole("alert", { name: "Falha ao salvar" })).toBeVisible();
  });
});
