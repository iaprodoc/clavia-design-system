import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Collapsible } from "./Collapsible";

describe("Collapsible", () => {
  it("revela conteúdo com a semântica de botão e região", () => {
    render(<Collapsible title="Detalhes avançados">Conteúdo complementar</Collapsible>);

    const trigger = screen.getByRole("button", { name: "Detalhes avançados" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region", { name: "Detalhes avançados" })).not.toBeInTheDocument();

    trigger.focus();
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Detalhes avançados" })).toHaveTextContent(
      "Conteúdo complementar",
    );
  });

  it("mantém o estado controlado sob responsabilidade do consumidor", () => {
    const onOpenChange = vi.fn();

    render(
      <Collapsible isOpen={false} onOpenChange={onOpenChange} title="Configurações avançadas">
        Conteúdo complementar
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Configurações avançadas" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(
      screen.queryByRole("region", { name: "Configurações avançadas" }),
    ).not.toBeInTheDocument();
  });

  it("não aciona nem expõe conteúdo quando está desabilitado", () => {
    const onOpenChange = vi.fn();

    render(
      <Collapsible disabled onOpenChange={onOpenChange} title="Detalhes indisponíveis">
        Conteúdo complementar
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Detalhes indisponíveis" });
    fireEvent.click(trigger);

    expect(trigger).toBeDisabled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("region", { name: "Detalhes indisponíveis" }),
    ).not.toBeInTheDocument();
  });
});
