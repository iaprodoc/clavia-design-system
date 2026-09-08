import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OperationalAlert } from "./OperationalAlert";

describe("OperationalAlert", () => {
  it("comunica impacto, ação e detalhes expansíveis", () => {
    render(
      <OperationalAlert
        actions={<button type="button">Resolver agora</button>}
        details="Três conexões exigem atenção."
        impact="3 integrações afetadas"
        title="Conexões interrompidas"
      >
        A entrega está pausada.
      </OperationalAlert>,
    );
    const alert = screen.getByRole("alert", { name: "Conexões interrompidas" });

    expect(alert).toHaveClass("clv-alert--inline", "clv-operational-alert");
    expect(alert.querySelector(".clv-alert__message")).toHaveTextContent("3 integrações afetadas");
    expect(alert.querySelector(".clv-alert__actions")).toContainElement(
      screen.getByRole("button", { name: "Resolver agora" }),
    );
    expect(screen.getByRole("button", { name: "Resolver agora" })).toBeVisible();
    fireEvent.click(screen.getByText("Ver detalhes"));
    expect(screen.getByText("Três conexões exigem atenção.")).toBeVisible();
  });

  it("mantém a semântica urgente na severidade informativa", () => {
    render(
      <OperationalAlert
        actions={<button type="button">Ver atividade</button>}
        severity="info"
        title="Processamento em andamento"
      />,
    );

    expect(screen.getByRole("alert", { name: "Processamento em andamento" })).toHaveClass(
      "clv-alert--info",
    );
  });

  it("organiza impacto e ação no rodapé da variação featured", () => {
    render(
      <OperationalAlert
        actions={<button type="button">Revisar fila</button>}
        impact="3 pendências"
        title="Revisão necessária"
        variant="featured"
      >
        Algumas entradas exigem validação manual.
      </OperationalAlert>,
    );

    const alert = screen.getByRole("alert", { name: "Revisão necessária" });

    expect(alert).toHaveClass("clv-alert--featured", "clv-operational-alert");
    expect(alert.querySelector(".clv-alert__metadata")).toHaveTextContent("3 pendências");
    expect(alert.querySelector(".clv-alert__footer")).toBeInTheDocument();
    expect(alert.querySelector(".clv-alert__actions")).toContainElement(
      screen.getByRole("button", { name: "Revisar fila" }),
    );
  });

  it("preserva o resumo expansível no teclado", () => {
    render(
      <OperationalAlert
        actions={<button type="button">Resolver agora</button>}
        details="Mais dados"
        title="Integração indisponível"
      >
        A entrega está pausada.
      </OperationalAlert>,
    );

    const summary = screen.getByText("Ver detalhes");
    summary.focus();
    fireEvent.keyDown(summary, { key: "Enter" });
    fireEvent.click(summary);

    expect(screen.getByText("Mais dados")).toBeVisible();
  });
});
