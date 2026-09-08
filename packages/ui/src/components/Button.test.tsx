import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("dispara a ação quando está disponível", () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Continuar</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("fica indisponível e anuncia atividade durante o carregamento", () => {
    render(<Button isLoading>Continuar</Button>);

    const button = screen.getByRole("button", { name: "Continuar" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".clv-button__spinner")).toBeInTheDocument();
    expect(button.querySelector(".clv-button__label")).toHaveTextContent("Continuar");
  });

  it("combina tamanho, hierarquia e ícones sem alterar o nome acessível", () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading-icon" />}
        size="lg"
        trailingIcon={<span data-testid="trailing-icon" />}
        variant="tertiary"
      >
        Revisar agenda
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Revisar agenda" });

    expect(button).toHaveClass(
      "clv-button--tertiary",
      "clv-button--size-lg",
      "clv-button--has-trailing-icon",
    );
    expect(button.querySelector(".clv-button__icon--leading")).toContainElement(
      screen.getByTestId("leading-icon"),
    );
    expect(button.querySelector(".clv-button__icon--trailing")).toContainElement(
      screen.getByTestId("trailing-icon"),
    );
  });

  it("expõe a escala extra compacta para ações auxiliares densas", () => {
    render(
      <Button size="xs" variant="surface">
        Ver recibo
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Ver recibo" })).toHaveClass(
      "clv-button--size-xs",
      "clv-button--surface",
    );
  });

  it("expõe a variante gradient como opção de ênfase", () => {
    render(<Button variant="gradient">Finalizar onboarding</Button>);

    expect(screen.getByRole("button", { name: "Finalizar onboarding" })).toHaveClass(
      "clv-button--gradient",
    );
  });

  it("expõe a variante surface para ações sobre fundos claros", () => {
    render(<Button variant="surface">Ver detalhes</Button>);

    expect(screen.getByRole("button", { name: "Ver detalhes" })).toHaveClass("clv-button--surface");
  });

  it("cobre variantes base e o modo de ícone isolado", () => {
    render(
      <>
        <Button variant="outline">Ver detalhes</Button>
        <Button variant="danger-soft">Excluir rascunho</Button>
        <Button aria-label="Avançar" isIconOnly>
          →
        </Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Ver detalhes" })).toHaveClass("clv-button--outline");
    expect(screen.getByRole("button", { name: "Excluir rascunho" })).toHaveClass(
      "clv-button--danger-soft",
    );
    expect(screen.getByRole("button", { name: "Avançar" })).toHaveClass("clv-button--icon-only");
  });

  it("aceita os nomes de estado do contrato padrão", () => {
    render(
      <Button isDisabled isPending>
        Salvando
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Salvando" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("expõe a variante text para ações discretas sem superfície", () => {
    render(<Button variant="text">Cancelar</Button>);

    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveClass("clv-button--text");
  });

  it("expõe a variante glass sem impor um ícone à ação", () => {
    render(
      <Button trailingIcon={<span data-testid="glass-icon" />} variant="glass">
        Conhecer a próxima etapa
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Conhecer a próxima etapa" });

    expect(button).toHaveClass("clv-button--glass");
    expect(button.querySelector(".clv-button__glass-action")).not.toBeInTheDocument();
    expect(button.querySelector(".clv-button__icon--trailing")).toContainElement(
      screen.getByTestId("glass-icon"),
    );
  });

  it("ocupa a largura disponível quando a ação é prioritária no mobile", () => {
    render(<Button fullWidth>Continuar no celular</Button>);

    expect(screen.getByRole("button", { name: "Continuar no celular" })).toHaveClass(
      "clv-button--full-width",
    );
  });

  it("expõe o vidro adaptativo nos contextos claro e escuro", () => {
    const { rerender } = render(<Button variant="adaptive-glass">Revisar</Button>);

    const button = screen.getByRole("button", { name: "Revisar" });

    expect(button).toHaveClass("clv-button--adaptive-glass");
    expect(button).toHaveAttribute("data-tone", "default");
    expect(button.querySelector(".clv-button__glass-action")).not.toBeInTheDocument();

    rerender(
      <Button tone="on-dark" variant="adaptive-glass">
        Revisar
      </Button>,
    );

    expect(button).toHaveAttribute("data-tone", "on-dark");
  });
});
