import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./Progress";

describe("Progress", () => {
  it("limita o valor e expõe o progresso para tecnologias assistivas", () => {
    render(<Progress label="Etapa atual" value={150} />);

    expect(screen.getByRole("progressbar", { name: "Etapa atual" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("mantém o valor acessível na variação circular", () => {
    render(<Progress label="Configuração" value={75} variant="circular" />);

    const progress = screen.getByRole("progressbar", { name: "Configuração" });
    expect(progress).toHaveAttribute("aria-valuenow", "75");
    expect(progress).toHaveTextContent("75%");
    expect(progress.querySelector(".clv-progress__circular-indicator")).toHaveAttribute(
      "stroke-linecap",
      "round",
    );
  });
});
