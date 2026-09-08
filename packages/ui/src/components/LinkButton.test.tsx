import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
  it("mantém a semântica de link e bloqueia a navegação quando desabilitado", () => {
    const onClick = vi.fn();
    render(
      <LinkButton href="/orientacoes" isDisabled onClick={onClick}>
        Ver orientações
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "Ver orientações" });
    const event = createEvent.click(link);
    fireEvent(link, event);

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });
});
