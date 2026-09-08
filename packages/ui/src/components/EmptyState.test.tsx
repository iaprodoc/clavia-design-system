import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("posiciona a ilustração padrão antes do conteúdo textual", () => {
    const { container } = render(
      <EmptyState description="Adicione uma regra para começar." title="Nenhuma regra adicional" />,
    );

    const region = screen.getByRole("region", { name: "Nenhuma regra adicional" });
    const illustration = container.querySelector(".clv-empty-state__illustration");
    const title = screen.getByRole("heading", { name: "Nenhuma regra adicional" });

    expect(illustration).toBeInTheDocument();
    expect(illustration?.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(region).toContainElement(title);
    expect(
      container.querySelector('[data-empty-state-asset="img_empty_state2.webp"]'),
    ).toBeInTheDocument();
  });

  it("aceita uma ilustração contextual ou permite omiti-la", () => {
    const { rerender } = render(
      <EmptyState
        description="Use a busca para começar."
        illustration={<span data-testid="custom-illustration">Busca</span>}
        title="Nenhum resultado"
      />,
    );

    expect(screen.getByTestId("custom-illustration")).toBeInTheDocument();

    rerender(
      <EmptyState
        description="Use a busca para começar."
        illustration={null}
        title="Nenhum resultado"
      />,
    );

    expect(screen.queryByTestId("custom-illustration")).not.toBeInTheDocument();
    expect(document.querySelector(".clv-empty-state__illustration")).not.toBeInTheDocument();
  });
});
