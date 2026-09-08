import { BuildingIcon, CalendarSyncIcon, TargetIcon } from "@clavia-ds/icons";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StepCard } from "./StepCard";
import { Stepper } from "./Stepper";

describe("progresso do onboarding", () => {
  it("mantém números explícitos e anuncia a etapa atual", () => {
    render(
      <Stepper
        label="Etapas do onboarding"
        progress={60}
        steps={[
          { id: "clinica", label: "Sobre a Clínica", number: 1, status: "completed" },
          { id: "processo", label: "Processo Comercial", number: 3, status: "current" },
          { id: "agenda", label: "Compartilhar Agenda", number: 7, status: "available" },
        ]}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Etapas do onboarding" });
    expect(navigation).toHaveTextContent("1");
    expect(navigation).toHaveTextContent("Processo Comercial");
    expect(navigation).toHaveTextContent("Disponível");
    const currentStep = screen.getByText("Processo Comercial").closest("li");
    expect(navigation).toHaveAttribute("data-orientation", "vertical");
    expect(currentStep).toHaveAttribute("aria-current", "step");
    expect(currentStep).toHaveTextContent("Em andamento, 60% concluído");
    expect(navigation).toHaveTextContent("7");
  });

  it("expõe a variante horizontal e anuncia o progresso normalizado da etapa atual", () => {
    render(
      <Stepper
        ellipsis
        label="Seções do formulário"
        orientation="horizontal"
        progress={140}
        size="compact"
        steps={[
          { id: "escopo", label: "Escopo", number: 1, status: "completed" },
          { id: "regras", label: "Regras", number: 2, status: "current" },
          { id: "handoff", label: "Handoff", number: 3, status: "available" },
        ]}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Seções do formulário" });
    const currentStep = screen.getByText("Regras").closest("li");

    expect(navigation).toHaveAttribute("data-orientation", "horizontal");
    expect(navigation).toHaveAttribute("data-size", "compact");
    expect(navigation).toHaveAttribute("data-ellipsis", "true");
    expect(currentStep).toHaveAttribute("data-progress", "true");
    expect(currentStep).toHaveTextContent("Em andamento, 100% concluído");
    expect(
      screen.getByRole("progressbar", { name: "Progresso da etapa atual: 100%" }),
    ).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("Escopo").closest("li")).not.toHaveAttribute("data-progress");
  });

  it("mantém o status acessível quando a linha visual é ocultada", () => {
    render(
      <Stepper
        label="Seções do formulário"
        showStatus={false}
        steps={[{ id: "regras", label: "Regras", number: 1, status: "current" }]}
      />,
    );

    const status = screen.getByText("Em andamento");

    expect(status).toHaveClass("clv-stepper__status", "clv-sr-only");
    expect(status).toBeInTheDocument();
  });

  it("oferece uma variante compacta para a navegação de fases", () => {
    render(
      <Stepper
        label="Fases do onboarding"
        orientation="horizontal"
        showStatus={false}
        variant="phase-navigation"
        steps={[
          { id: "configuracao", label: "Configuração", number: 1, status: "current" },
          { id: "briefing", label: "Briefing", number: 2, status: "blocked" },
        ]}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Fases do onboarding" });
    const currentStep = screen.getByText("Configuração").closest("li");

    expect(navigation).toHaveAttribute("data-variant", "phase-navigation");
    expect(currentStep).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Bloqueada")).toHaveClass("clv-stepper__status", "clv-sr-only");
  });

  it("permite navegar entre etapas disponíveis pelo teclado quando recebe uma ação", () => {
    const onStepChange = vi.fn();

    render(
      <Stepper
        label="Fases navegáveis"
        onStepChange={onStepChange}
        orientation="horizontal"
        steps={[
          { id: "dados", label: "Dados", number: 1, status: "completed" },
          { id: "regras", label: "Regras", number: 2, status: "current" },
          { id: "revisao", label: "Revisão", number: 3, status: "available" },
          { id: "envio", label: "Envio", number: 4, status: "blocked" },
        ]}
      />,
    );

    const controls = screen.getAllByRole("button");
    expect(controls).toHaveLength(3);
    expect(screen.queryByRole("button", { name: /Envio/ })).not.toBeInTheDocument();
    const [firstControl, currentControl, finalControl] = controls;

    if (!firstControl || !currentControl || !finalControl) {
      throw new Error("Os controles navegáveis esperados não foram renderizados.");
    }

    firstControl.focus();
    fireEvent.keyDown(firstControl, { key: "ArrowRight" });
    expect(currentControl).toHaveFocus();
    fireEvent.keyDown(currentControl, { key: "End" });
    expect(finalControl).toHaveFocus();
    fireEvent.keyDown(finalControl, { key: "Home" });
    expect(firstControl).toHaveFocus();
    fireEvent.click(currentControl);
    expect(onStepChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "regras", status: "current" }),
    );
  });

  it("prepara um tooltip nomeado com o título da etapa quando solicitado", () => {
    render(
      <Stepper
        label="Fases do onboarding"
        orientation="horizontal"
        steps={[
          {
            id: "processo",
            label: "Processo Comercial",
            number: <TargetIcon />,
            status: "current",
            tooltipLabel: "Informações sobre Processo Comercial",
          },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Informações sobre Processo Comercial",
    });

    expect(trigger).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("Processo Comercial").closest("li")).toContainElement(trigger);
  });

  it("só apresenta interação quando uma ação é fornecida", () => {
    const onClick = vi.fn();

    const { rerender } = render(
      <StepCard
        description="Defina as regras de atendimento."
        leadingIcon={<TargetIcon />}
        number={3}
        onClick={onClick}
        status="current"
        title="Processo Comercial"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Processo Comercial/ }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <StepCard
        description="Disponível depois da configuração da clínica."
        leadingIcon={<CalendarSyncIcon />}
        number={7}
        status="blocked"
        title="Compartilhar Agenda"
      />,
    );

    expect(screen.queryByRole("button", { name: /Compartilhar Agenda/ })).not.toBeInTheDocument();
    expect(screen.getByText("Etapa 7. Status: Bloqueada.")).toHaveClass("clv-sr-only");
  });

  it("recria a anatomia do legado com componentes semânticos", () => {
    const onClick = vi.fn();

    const { container } = render(
      <StepCard
        description="Informações básicas, horários, serviços e profissionais"
        leadingIcon={<BuildingIcon data-testid="clinic-icon" />}
        number={1}
        onClick={onClick}
        status="completed"
        title="Sobre a Clínica"
      />,
    );

    const card = screen.getByRole("button", { name: /Sobre a Clínica/ });
    const accessibleStatus = screen.getByText("Etapa 1. Status: Concluída.");

    expect(card).toHaveTextContent("Etapa 1");
    expect(accessibleStatus).toHaveClass("clv-sr-only");
    expect(container.querySelector(".clv-step-card__meta")).not.toBeInTheDocument();
    expect(screen.getByText("Concluída").closest(".clv-status-badge")).not.toBeNull();
    expect(container.querySelector(".clv-step-card__status")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("clinic-icon")).toBeInTheDocument();
    expect(container.querySelector(".clv-step-card__indicator svg")).toBeInTheDocument();
    expect(container.querySelector(".clv-step-card__chevron svg")).toBeInTheDocument();
  });

  it("mantém etapas bloqueadas indisponíveis e sem affordance de navegação", () => {
    const { container } = render(
      <StepCard
        description="Disponível depois da configuração da clínica."
        leadingIcon={<CalendarSyncIcon />}
        number={7}
        onClick={() => undefined}
        status="blocked"
        title="Compartilhar Agenda"
      />,
    );

    expect(screen.getByRole("button", { name: /Compartilhar Agenda/ })).toBeDisabled();
    expect(container.querySelector(".clv-step-card__indicator svg")).toBeInTheDocument();
    expect(container.querySelector(".clv-step-card__chevron")).not.toBeInTheDocument();
  });

  it("aceita um ícone contextual sem alterar o nome acessível", () => {
    render(
      <StepCard
        description="Defina as regras de atendimento."
        leadingIcon={<span data-testid="context-icon">C</span>}
        number={3}
        onClick={() => undefined}
        status="current"
        title="Processo Comercial"
      />,
    );

    expect(screen.getByTestId("context-icon").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: /Processo Comercial/ })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });
});
