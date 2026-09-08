import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { TagInput } from "./TagInput";

function ControlledTagInput({ maxTags = 4 }: { maxTags?: number }) {
  const [values, setValues] = useState(["Consulta", "Retorno"]);
  return (
    <TagInput
      description="Cadastre os serviços principais."
      label="Serviços"
      maxTags={maxTags}
      onChange={setValues}
      values={values}
    />
  );
}

describe("TagInput", () => {
  it("adiciona, edita e remove itens por controles acessíveis", () => {
    render(<ControlledTagInput />);
    const input = screen.getByRole("textbox", { name: "Serviços" });

    fireEvent.change(input, { target: { value: "Avaliação" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Avaliação")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Editar Consulta" }));
    expect(input).toHaveValue("Consulta");
    fireEvent.change(input, { target: { value: "Primeira consulta" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar edição" }));
    expect(screen.getByText("Primeira consulta")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remover Retorno" }));
    expect(screen.queryByText("Retorno")).not.toBeInTheDocument();
  });

  it("usa o catálogo de ícones sem transferir o nome da ação ao SVG", () => {
    render(<ControlledTagInput />);

    const editButton = screen.getByRole("button", { name: "Editar Consulta" });
    const removeButton = screen.getByRole("button", { name: "Remover Consulta" });

    const editIcon = editButton.querySelector("svg");
    const removeIcon = removeButton.querySelector("svg");

    expect(editIcon).toHaveAttribute("data-icon-source", "phosphor");
    expect(removeIcon).toHaveAttribute("data-icon-source", "phosphor");
    expect(editIcon).toHaveAttribute("data-icon-weight", "bold");
    expect(removeIcon).toHaveAttribute("data-icon-weight", "bold");
    expect(editIcon).toHaveAttribute("aria-hidden", "true");
    expect(removeIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("remove o último item com Backspace e recusa duplicatas", () => {
    render(<ControlledTagInput />);
    const input = screen.getByRole("textbox", { name: "Serviços" });

    fireEvent.keyDown(input, { key: "Backspace" });
    expect(screen.queryByText("Retorno")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "consulta" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("alert")).toHaveTextContent("Este item já foi adicionado.");
  });

  it("aplica o limite antes de chamar onChange", () => {
    const onChange = vi.fn();
    render(<TagInput label="Serviços" maxTags={2} onChange={onChange} values={["A", "B"]} />);

    expect(screen.getByRole("textbox", { name: "Serviços" })).toBeDisabled();
    expect(screen.getByText("2 de 2 itens")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
