import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClaviaLogo } from "./ClaviaLogo";

describe("ClaviaLogo", () => {
  it("usa a assinatura principal e o tom principal por padrão", () => {
    render(<ClaviaLogo />);

    const logo = screen.getByRole("img", { name: "Clavia" });

    expect(logo).toHaveAttribute("viewBox", "0 0 266 79");
    expect(logo).toHaveAttribute("data-lockup", "wordmark");
    expect(logo).toHaveAttribute("data-tone", "primary");
    expect(logo).toHaveClass("clv-logo", "clv-logo--primary");
  });

  it("publica a assinatura com tagline sem transformar o texto em fonte", () => {
    render(<ClaviaLogo lockup="tagline" tone="inverse" />);

    const logo = screen.getByRole("img", { name: "Clavia, Inteligência Comercial" });

    expect(logo).toHaveAttribute("viewBox", "0 0 266 103");
    expect(logo).toHaveAttribute("data-lockup", "tagline");
    expect(logo).toHaveAttribute("data-tone", "inverse");
    expect(logo.querySelectorAll("path").length).toBeGreaterThan(7);
  });

  it("aceita nome acessível contextual e uso decorativo", () => {
    const { rerender } = render(<ClaviaLogo aria-label="Clavia Design System" />);

    expect(screen.getByRole("img", { name: "Clavia Design System" })).toBeVisible();

    rerender(<ClaviaLogo aria-hidden />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("aceita dimensões compactas definidas pelo contexto", () => {
    render(<ClaviaLogo width={80} />);

    expect(screen.getByRole("img", { name: "Clavia" })).toHaveAttribute("width", "80");
  });
});
