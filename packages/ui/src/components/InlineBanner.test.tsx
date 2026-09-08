import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InlineBanner } from "./InlineBanner";

describe("InlineBanner", () => {
  it("mantém o aviso contextual e a ação disponível", () => {
    render(
      <InlineBanner action={<button type="button">Revisar</button>} title="Atenção">
        Há dados pendentes.
      </InlineBanner>,
    );
    const banner = screen.getByRole("status", { name: "Atenção" });
    const message = banner.querySelector(".clv-alert__message");
    const actions = banner.querySelector(".clv-alert__actions");

    expect(banner).toHaveClass("clv-inline-banner");
    expect(message).toHaveTextContent("Há dados pendentes.");
    expect(message).not.toContainElement(screen.getByRole("button", { name: "Revisar" }));
    expect(actions).toContainElement(screen.getByRole("button", { name: "Revisar" }));
  });
});
