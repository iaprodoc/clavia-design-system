import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./Slider";

const formatMonths = (value: number) => `${value} ${value === 1 ? "mês" : "meses"}`;

describe("Slider", () => {
  it("associa rótulo, ajuda e valor compreensível ao controle", () => {
    render(
      <Slider
        defaultValue={2}
        description="Defina por quanto tempo a agenda pode receber novos agendamentos."
        formatValue={formatMonths}
        label="Agenda liberada"
        maxValue={6}
        minValue={1}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Agenda liberada" });

    expect(slider).toHaveValue("2");
    expect(slider).toHaveAccessibleDescription(
      "Defina por quanto tempo a agenda pode receber novos agendamentos.",
    );
    expect(screen.getByText("2 meses")).toBeInTheDocument();

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider).toHaveValue("3");
    expect(screen.getByText("3 meses")).toBeInTheDocument();
  });

  it("encaminha alterações nos modos controlado e finalizado", () => {
    const onValueChange = vi.fn();
    const onValueChangeEnd = vi.fn();

    render(
      <Slider
        formatValue={formatMonths}
        label="Agenda liberada"
        maxValue={6}
        minValue={1}
        onValueChange={onValueChange}
        onValueChangeEnd={onValueChangeEnd}
        value={2}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Agenda liberada" });
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    fireEvent.keyUp(slider, { key: "ArrowRight" });

    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(onValueChangeEnd).toHaveBeenCalledWith(3);
    expect(screen.getByText("2 meses")).toBeInTheDocument();
  });

  it("suporta intervalo com dois controles identificáveis", () => {
    render(
      <Slider
        defaultValue={[100, 500]}
        formatOptions={{ currency: "BRL", style: "currency" }}
        label="Faixa de investimento"
        maxValue={1000}
        minValue={0}
        step={50}
        thumbLabels={["Investimento mínimo", "Investimento máximo"]}
      />,
    );

    expect(screen.getByRole("slider", { name: /Investimento mínimo/ })).toHaveValue("100");
    expect(screen.getByRole("slider", { name: /Investimento máximo/ })).toHaveValue("500");
  });

  it("expõe erro e estado desabilitado sem depender apenas da cor", () => {
    const { rerender } = render(
      <Slider
        defaultValue={2}
        error="Escolha uma janela de agenda entre 1 e 6 meses."
        label="Agenda liberada"
        maxValue={6}
        minValue={1}
      />,
    );

    const invalidSlider = screen.getByRole("slider", { name: "Agenda liberada" });

    const group = screen.getByRole("group", { name: "Agenda liberada" });

    expect(group).toHaveAttribute("data-invalid", "true");
    expect(invalidSlider).toHaveAccessibleDescription(
      "Escolha uma janela de agenda entre 1 e 6 meses.",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Escolha uma janela de agenda entre 1 e 6 meses.",
    );

    rerender(<Slider defaultValue={2} disabled label="Agenda liberada" />);

    expect(screen.getByRole("slider", { name: "Agenda liberada" })).toBeDisabled();
  });
});
