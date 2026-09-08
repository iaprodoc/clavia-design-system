import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";
import { KeyValue } from "./KeyValue";
import { MetricCard } from "./MetricCard";

describe("primitivas de dados", () => {
  it("deriva iniciais e substitui uma imagem indisponível no Avatar", () => {
    render(<Avatar name="Marina Almeida" src="/perfil-inacessivel.png" />);
    const avatar = screen.getByLabelText("Marina Almeida");

    fireEvent.error(avatar.querySelector(".clv-avatar__image") as HTMLImageElement);

    expect(avatar).toHaveAttribute("data-avatar-fallback", "true");
    expect(avatar).toHaveAttribute("data-avatar-state", "fallback");
    expect(avatar).toHaveTextContent("MA");
  });

  it("preserva classes e ids estáveis quando há labels repetidos", () => {
    render(
      <KeyValue
        className="custom-key-value"
        items={[
          { id: "first", label: "Status", value: "Ativo" },
          { id: "second", label: "Status", value: "Em revisão" },
        ]}
      />,
    );

    expect(screen.getByText("Ativo").tagName).toBe("DD");
    expect(document.querySelector(".custom-key-value")).toBeInTheDocument();
  });

  it("mantém rótulos e valores em uma lista de descrição", () => {
    render(<KeyValue items={[{ label: "Responsável", value: "Marina Almeida" }]} />);

    expect(screen.getByText("Responsável").tagName).toBe("DT");
    expect(screen.getByText("Marina Almeida").tagName).toBe("DD");
  });

  it("expõe a métrica sem transformar o card em ação", () => {
    render(
      <MetricCard
        label="Projetos ativos"
        tone="success"
        trend="12% acima do mês anterior"
        value="24"
      />,
    );
    const card = screen.getByText("Projetos ativos").closest(".clv-metric-card");

    expect(card).toHaveClass("clv-metric-card--success");
    expect(screen.getByRole("region", { name: "Projetos ativos" })).toBe(card);
    expect(card?.querySelector("button, a")).toBeNull();
    expect(screen.getByText("24")).toBeVisible();
  });

  it("formata contagens menores que dez com zero à esquerda quando solicitado", () => {
    render(<MetricCard label="Convites pendentes" value={2} valueFormat="two-digit" />);

    expect(screen.getByText("02")).toHaveAttribute("data-value-format", "two-digit");
  });

  it("posiciona uma tag curta ao lado do rótulo da métrica", () => {
    render(<MetricCard label="Projetos ativos" tag="+12%" value="24" />);

    const card = screen.getByRole("region", { name: "Projetos ativos" });
    expect(card.querySelector(".clv-metric-card__heading")).toHaveTextContent(
      "Projetos ativos+12%",
    );
    expect(card.querySelector(".clv-metric-card__tag")).toHaveTextContent("+12%");
  });

  it("move a descrição complementar para a ajuda contextual da métrica", () => {
    render(
      <MetricCard
        description="Inclui equipe e clientes exibidos."
        label="Acessos ativos"
        value="02"
      />,
    );

    const help = screen.getByRole("button", { name: "Mais informações sobre Acessos ativos" });

    expect(help).toBeVisible();
    expect(document.querySelector(".clv-metric-card__description")).not.toBeInTheDocument();
  });
});
