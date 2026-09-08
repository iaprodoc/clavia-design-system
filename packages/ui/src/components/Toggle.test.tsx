import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("mantém semântica de botão pressionado e alterna no uso não controlado", () => {
    const onPressedChange = vi.fn();

    render(
      <Toggle defaultPressed onPressedChange={onPressedChange}>
        Destaque
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "Destaque" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-state", "on");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });

  it("respeita o valor controlado e o tamanho visual", () => {
    const { rerender } = render(
      <Toggle aria-label="Fixar" pressed={false} size="lg" variant="outline" />,
    );

    const toggle = screen.getByRole("button", { name: "Fixar" });
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveClass("clv-toggle--size-lg", "clv-toggle--outline");

    rerender(<Toggle aria-label="Fixar" pressed />);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
