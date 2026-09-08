import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "./Field";
import { InputOTP } from "./InputOTP";

describe("InputOTP", () => {
  it("expõe um único campo de texto acessível e distribui o código nas posições", () => {
    const { container } = render(
      <Field id="codigo" label="Código de acesso">
        <InputOTP defaultValue="274" length={6} />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Código de acesso" });
    const slots = [...container.querySelectorAll<HTMLElement>(".clv-input-otp__slot")];

    expect(input).toHaveAttribute("id", "codigo");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("maxlength", "6");
    expect(slots).toHaveLength(6);
    expect(slots.slice(0, 3).map((slot) => slot.textContent)).toEqual(["2", "7", "4"]);
  });

  it("notifica mudanças e conclusão sem perder o contrato nativo do input", () => {
    const onComplete = vi.fn();
    const onValueChange = vi.fn();

    render(
      <InputOTP
        aria-label="Código de acesso"
        inputMode="numeric"
        length={6}
        onComplete={onComplete}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Código de acesso" });
    fireEvent.change(input, { target: { value: "274159" } });

    expect(input).toHaveValue("274159");
    expect(onValueChange).toHaveBeenCalledWith("274159");
    expect(onComplete).toHaveBeenCalledWith("274159");
  });

  it("mantém obrigatoriedade, erro e estado desabilitado", () => {
    render(
      <InputOTP aria-invalid="true" aria-label="Código de acesso" disabled length={4} required />,
    );

    const input = screen.getByRole("textbox", { name: "Código de acesso" });
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.closest(".clv-input-otp")).toHaveAttribute("data-disabled", "true");
  });
});
