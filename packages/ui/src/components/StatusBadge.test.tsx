import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge, StatusBadgeCheckIcon } from "./StatusBadge";

describe("StatusBadge", () => {
  it("preserva a API compacta anterior como outline pequeno", () => {
    render(<StatusBadge status="success">Ativo</StatusBadge>);

    const badge = screen.getByText("Ativo").closest(".clv-status-badge");

    expect(badge).toHaveClass(
      "clv-status-badge--success",
      "clv-status-badge--outline",
      "clv-status-badge--size-sm",
    );
    expect(badge).toHaveAttribute("data-status", "success");
    expect(badge).toHaveAttribute("data-variant", "outline");
  });

  it("permite identificar o badge na composição sem alterar sua semântica", () => {
    render(
      <StatusBadge className="custom-status" id="status-projeto">
        Ativo
      </StatusBadge>,
    );

    const badge = screen.getByText("Ativo").closest(".clv-status-badge");
    expect(badge).toHaveClass("custom-status");
    expect(badge).toHaveAttribute("id", "status-projeto");
  });

  it("combina status, tamanho, variante e ícones sem alterar o texto", () => {
    render(
      <StatusBadge
        leadingIcon={<span data-testid="leading-icon" />}
        size="md"
        status="danger"
        trailingIcon={<span data-testid="trailing-icon" />}
        variant="solid"
      >
        Falha de conexão
      </StatusBadge>,
    );

    const label = screen.getByText("Falha de conexão");
    const badge = label.closest(".clv-status-badge");

    expect(badge).toHaveClass(
      "clv-status-badge--danger",
      "clv-status-badge--solid",
      "clv-status-badge--size-md",
      "clv-status-badge--has-leading-icon",
      "clv-status-badge--has-trailing-icon",
    );
    expect(badge?.querySelector(".clv-status-badge__icon--leading")).toContainElement(
      screen.getByTestId("leading-icon"),
    );
    expect(badge?.querySelector(".clv-status-badge__icon--trailing")).toContainElement(
      screen.getByTestId("trailing-icon"),
    );
  });

  it("oferece o tamanho extra pequeno para status inline", () => {
    render(
      <StatusBadge size="xs" status="success" variant="soft">
        Concluída
      </StatusBadge>,
    );

    expect(screen.getByText("Concluída").closest(".clv-status-badge")).toHaveClass(
      "clv-status-badge--size-xs",
    );
  });

  it("mantém os ícones decorativos fora do nome acessível", () => {
    render(
      <StatusBadge leadingIcon={<span>ícone</span>} trailingIcon={<span>detalhe</span>}>
        Rascunho
      </StatusBadge>,
    );

    expect(screen.getByText("ícone").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("detalhe").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Rascunho")).toBeInTheDocument();
  });

  it("oferece o check circular específico para badges", () => {
    render(
      <StatusBadge leadingIcon={<StatusBadgeCheckIcon />} status="info">
        Em andamento
      </StatusBadge>,
    );

    const badge = screen.getByText("Em andamento").closest(".clv-status-badge");
    const check = badge?.querySelector(".clv-status-badge__check-icon");

    expect(check).toBeInTheDocument();
    expect(check).toHaveAttribute("aria-hidden", "true");
    expect(check?.querySelector("svg")).toBeInTheDocument();
  });
});
