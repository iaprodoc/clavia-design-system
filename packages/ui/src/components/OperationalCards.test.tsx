import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionCard } from "./ActionCard";
import { MetricCard } from "./MetricCard";
import { NavigationCard } from "./NavigationCard";

describe("cartões operacionais", () => {
  it("separa métrica, ação e navegação pela semântica correta", () => {
    const onAction = vi.fn();
    render(
      <>
        <MetricCard label="Projetos ativos" value="24" />
        <ActionCard onAction={onAction} title="Conectar WhatsApp" />
        <NavigationCard href="/projetos" title="Projetos" />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Conectar WhatsApp/ }));

    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute("href", "/projetos");
    expect(
      screen.getByText("Projetos ativos").closest(".clv-metric-card")?.querySelector("a, button"),
    ).toBeNull();
  });

  it("não executa uma ação desabilitada", () => {
    const onAction = vi.fn();
    render(<ActionCard disabled onAction={onAction} title="Sincronizar dados" />);

    fireEvent.click(screen.getByRole("button", { name: /Sincronizar dados/ }));

    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Sincronizar dados/ })).toBeDisabled();
  });
});
