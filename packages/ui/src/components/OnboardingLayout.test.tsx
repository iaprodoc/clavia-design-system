import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";
import { PageHeader } from "./PageHeader";
import { SaveStatus } from "./SaveStatus";
import { StickyActionBar } from "./StickyActionBar";

describe("composições do onboarding", () => {
  it("organiza contexto, título, descrição e ações sem criar uma navegação implícita", () => {
    render(
      <PageHeader
        actions={<Button variant="ghost">Salvar e sair</Button>}
        description="Defina como a clínica orienta o atendimento comercial."
        eyebrow="Etapa 3 de 5"
        navigation={<a href="#processo">Voltar ao processo</a>}
        title="Processo Comercial"
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Processo Comercial" })).toBeVisible();
    expect(screen.getByText("Etapa 3 de 5")).toBeVisible();
    expect(screen.getByRole("link", { name: "Voltar ao processo" })).toHaveAttribute(
      "href",
      "#processo",
    );
    expect(screen.getByRole("button", { name: "Salvar e sair" })).toBeEnabled();
  });

  it("permite ajustar o nível do título em composições embutidas", () => {
    render(<PageHeader headingAs="h3" title="Processo Comercial" />);

    expect(screen.getByRole("heading", { level: 3, name: "Processo Comercial" })).toBeVisible();
  });

  it("preserva as ações fornecidas pelo fluxo e expõe o estado de salvamento", () => {
    const onContinue = vi.fn();

    render(
      <StickyActionBar
        previousAction={
          <Button disabled variant="ghost">
            Anterior
          </Button>
        }
        primaryAction={<Button onClick={onContinue}>Próximo</Button>}
        status={<SaveStatus lastSavedAt="10:42" status="saved" />}
        tone="on-dark"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Próximo" }));

    expect(screen.getByRole("region", { name: "Ações da etapa" })).toHaveAttribute(
      "data-tone",
      "on-dark",
    );
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(onContinue).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toHaveTextContent("Alterações salvas às 10:42");
  });

  it("permite tentar novamente apenas quando o salvamento falhar", () => {
    const onRetry = vi.fn();

    const { rerender } = render(<SaveStatus onRetry={onRetry} status="error" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível salvar");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(<SaveStatus status="saved" />);
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).not.toBeInTheDocument();
  });
});
