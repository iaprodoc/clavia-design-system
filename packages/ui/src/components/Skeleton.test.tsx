import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("comunica o carregamento e reserva as dimensões informadas", () => {
    render(<Skeleton height={48} label="Carregando prontuário" shape="text" width="75%" />);

    const skeleton = screen.getByRole("status", { name: "Carregando prontuário" });

    expect(skeleton).toHaveClass("clv-skeleton--text");
    expect(skeleton).toHaveStyle({ height: "48px", width: "75%" });
  });

  it("permite escolher o movimento ou removê-lo", () => {
    const { rerender } = render(<Skeleton motion="pulse" />);

    expect(document.querySelector(".clv-skeleton")).toHaveClass("clv-skeleton--motion-pulse");

    rerender(<Skeleton motion="none" />);
    expect(document.querySelector(".clv-skeleton")).toHaveClass("clv-skeleton--motion-none");
  });
});
