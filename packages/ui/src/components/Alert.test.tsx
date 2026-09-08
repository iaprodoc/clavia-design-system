import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./Alert";

describe("Alert", () => {
  it("comunica avisos críticos com texto, ícone e semântica de alerta", () => {
    render(<Alert status="danger">Funciona apenas com WhatsApp Business.</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("clv-alert", "clv-alert--danger");
    expect(alert).toHaveTextContent("Funciona apenas com WhatsApp Business.");
    expect(alert.querySelector(".clv-alert__icon svg")).toBeInTheDocument();
    expect(alert.querySelector(".clv-alert__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("usa status educado para informação e permite um título contextual", () => {
    render(
      <Alert status="info" title="Informação de integração">
        Use o aplicativo oficial para continuar.
      </Alert>,
    );

    const status = screen.getByRole("status");

    expect(status).toHaveAccessibleName("Informação de integração");
    expect(status).toHaveTextContent("Use o aplicativo oficial para continuar.");
    expect(status.querySelector(".clv-alert__main")).not.toBeInTheDocument();
    expect(status.children[0]).toHaveClass("clv-alert__icon");
    expect(status.children[1]).toHaveClass("clv-alert__content");
    expect(status.querySelector(".clv-alert__content strong")).toHaveTextContent(
      "Informação de integração",
    );
  });

  it("expõe o tamanho compacto sem alterar a semântica do aviso", () => {
    render(<Alert size="sm" status="success" title="Perfil atualizado" />);

    const status = screen.getByRole("status", { name: "Perfil atualizado" });

    expect(status).toHaveClass("clv-alert--size-sm");
    expect(status.querySelector(".clv-alert__message")).not.toBeInTheDocument();
  });

  it("mantém fechamento compacto no alerta sem reduzir a área acionável", () => {
    render(<Alert onDismiss={() => {}} size="sm" status="success" title="Perfil atualizado" />);

    const dismiss = screen.getByRole("button", { name: "Fechar alerta" });

    expect(dismiss).toHaveClass("clv-close-button", "clv-icon-button--size-xs");
    expect(dismiss.querySelector("svg")).toBeInTheDocument();
  });

  it("organiza indicador, conteúdo e ação como filhos diretos no alerta inline", () => {
    render(
      <Alert
        actions={<button type="button">Atualizar</button>}
        status="info"
        title="Atualização disponível"
      >
        Uma nova versão está pronta para uso.
      </Alert>,
    );

    const status = screen.getByRole("status", { name: "Atualização disponível" });

    expect(status.children[0]).toHaveClass("clv-alert__icon");
    expect(status.children[1]).toHaveClass("clv-alert__content");
    expect(status.children[2]).toHaveClass("clv-alert__actions");
    expect(screen.getByRole("button", { name: "Atualizar" })).toBeVisible();
  });

  it("organiza contexto e próxima ação no rodapé da variante destacada", async () => {
    const onDismiss = vi.fn();

    render(
      <Alert
        actions={<button type="button">Ver atendimento</button>}
        metadata={<span>Paciente: Ana Souza</span>}
        onDismiss={onDismiss}
        status="success"
        title="Cadastro validado"
        variant="featured"
      >
        O paciente pode seguir para a confirmação da consulta.
      </Alert>,
    );

    const status = screen.getByRole("status", { name: "Cadastro validado" });

    expect(status).toHaveClass("clv-alert--featured");
    expect(status).not.toHaveClass("clv-alert--inline");
    expect(status.querySelector(".clv-alert__aura")).toBeInTheDocument();
    expect(screen.getByText("Paciente: Ana Souza")).toBeVisible();
    expect(screen.getByRole("button", { name: "Ver atendimento" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Fechar alerta" }));

    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
