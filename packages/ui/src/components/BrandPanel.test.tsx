import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandPanel } from "./BrandPanel";
import { Button } from "./Button";

describe("BrandPanel", () => {
  it("organiza mensagem, ação e mídia em uma região nomeada", () => {
    render(
      <BrandPanel
        actions={<Button variant="glass">Continuar</Button>}
        description="Revise o contexto antes de seguir."
        eyebrow="Briefing concluído"
        media={<img alt="Prévia abstrata da etapa" src="/preview.png" />}
        title="A implementação pode começar"
      />,
    );

    expect(screen.getByRole("region", { name: "A implementação pode começar" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "A implementação pode começar",
    );
    expect(screen.getByRole("button", { name: "Continuar" })).toHaveClass("clv-button--glass");
    expect(screen.getByRole("img", { name: "Prévia abstrata da etapa" })).toBeVisible();
  });

  it("permite ajustar o nível do título e compor classes do consumidor", () => {
    render(<BrandPanel className="preview-panel" headingAs="h1" title="Boas-vindas à Clavia" />);

    expect(screen.getByRole("heading", { level: 1, name: "Boas-vindas à Clavia" })).toBeVisible();
    expect(screen.getByRole("region")).toHaveClass("clv-brand-panel", "preview-panel");
  });
});
