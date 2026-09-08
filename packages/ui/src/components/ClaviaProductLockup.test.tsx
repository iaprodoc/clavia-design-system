import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClaviaProductLockup } from "./ClaviaProductLockup";

describe("ClaviaProductLockup", () => {
  it("combina o wordmark com o nome acessível da solução", () => {
    render(<ClaviaProductLockup solution="Hub" />);

    const lockup = screen.getByRole("img", { name: "Clavia Hub" });

    expect(lockup).toHaveClass("clv-product-lockup", "clv-product-lockup--primary");
    expect(lockup).toHaveAttribute("data-tone", "primary");
    expect(lockup).toHaveTextContent("Hub");
    expect(lockup.querySelector(".clv-logo")).toHaveAttribute("width", "88");
    expect(lockup.querySelector(".clv-logo")).toHaveAttribute("aria-hidden", "true");
  });

  it("aceita outra solução curta, tom e largura do wordmark", () => {
    render(<ClaviaProductLockup solution="App" tone="inverse" wordmarkWidth={104} />);

    const lockup = screen.getByRole("img", { name: "Clavia App" });

    expect(lockup).toHaveClass("clv-product-lockup--inverse");
    expect(lockup).toHaveTextContent("App");
    expect(lockup.querySelector(".clv-logo")).toHaveAttribute("width", "104");
  });

  it("aceita nome acessível contextual e uso decorativo", () => {
    const { rerender } = render(
      <ClaviaProductLockup aria-label="Área de operações Clavia" solution="Hub" />,
    );

    expect(screen.getByRole("img", { name: "Área de operações Clavia" })).toBeVisible();

    rerender(<ClaviaProductLockup aria-hidden solution="Hub" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
