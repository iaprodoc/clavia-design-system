import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClaviaIcon } from "./ClaviaIcon";

describe("ClaviaIcon", () => {
  it("publica a redução oficial com nome acessível e tamanho padrão", () => {
    render(<ClaviaIcon />);

    const icon = screen.getByRole("img", { name: "Clavia" });

    expect(icon).toHaveAttribute("viewBox", "0 0 456 456");
    expect(icon).toHaveAttribute("width", "48");
    expect(icon).toHaveAttribute("height", "48");
    expect(icon).toHaveClass("clv-icon");
  });

  it("aceita tamanho e nome contextual sem liberar variações visuais", () => {
    render(<ClaviaIcon aria-label="Clavia App" size={32} />);

    const icon = screen.getByRole("img", { name: "Clavia App" });

    expect(icon).toHaveAttribute("width", "32");
    expect(icon).toHaveAttribute("height", "32");
  });

  it("aceita uso decorativo e gera ids isolados por instância", () => {
    const { container } = render(
      <>
        <ClaviaIcon aria-hidden />
        <ClaviaIcon aria-hidden />
      </>,
    );

    const icons = container.querySelectorAll(".clv-icon");
    const firstClipId = icons[0]?.querySelector("clipPath")?.id;
    const secondClipId = icons[1]?.querySelector("clipPath")?.id;

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(firstClipId).toBeTruthy();
    expect(secondClipId).toBeTruthy();
    expect(firstClipId).not.toBe(secondClipId);
  });
});
