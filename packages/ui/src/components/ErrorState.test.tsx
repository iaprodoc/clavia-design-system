import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("explica a falha e oferece uma recuperação acessível", () => {
    const onRetry = vi.fn();

    render(
      <ErrorState
        action={<Button onClick={onRetry}>Tentar novamente</Button>}
        description="Verifique sua conexão e tente outra vez."
        title="Não foi possível carregar"
      />,
    );

    const alert = screen.getByRole("alert", { name: "Não foi possível carregar" });
    expect(alert).toHaveAccessibleDescription("Verifique sua conexão e tente outra vez.");
    expect(alert.querySelector(".clv-error-state__icon")).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
