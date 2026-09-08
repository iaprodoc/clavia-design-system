import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field } from "./Field";
import { Input } from "./Input";

describe("Field", () => {
  it("associa rótulo, ajuda e erro ao campo", () => {
    const { container } = render(
      <Field
        error="Informe um telefone válido."
        help="Usaremos este número para retorno."
        id="telefone"
        label="Telefone"
        required
      >
        <Input />
      </Field>,
    );

    const input = screen.getByLabelText(/Telefone/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "telefone-help telefone-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Informe um telefone válido.");
    expect(container.querySelector(".clv-field")).toHaveAttribute("data-motion", "enter");
    expect(container.querySelector(".clv-field__required-marker")).toHaveTextContent("*");
  });

  it("permite desativar a entrada suave em superfícies densas", () => {
    const { container } = render(
      <Field id="nome" label="Nome" motion="none">
        <Input />
      </Field>,
    );

    expect(container.querySelector(".clv-field")).toHaveAttribute("data-motion", "none");
  });

  it("preserva uma descrição já fornecida pelo controle", () => {
    render(
      <Field help="Usaremos este nome no perfil público." id="nome" label="Nome">
        <Input aria-describedby="nome-contexto" />
      </Field>,
    );

    expect(screen.getByLabelText("Nome")).toHaveAttribute(
      "aria-describedby",
      "nome-contexto nome-help",
    );
  });

  it("expõe o marcador obrigatório quando o controle já declara required", () => {
    const { container } = render(
      <Field id="email" label="E-mail">
        <Input required />
      </Field>,
    );

    expect(screen.getByLabelText(/E-mail/)).toBeRequired();
    expect(container.querySelector(".clv-field")).toHaveAttribute("data-required", "true");
    expect(container.querySelector(".clv-field__required-marker")).toHaveTextContent("*");
  });

  it("expõe orientação curta sob demanda sem descrevê-la como ajuda persistente", () => {
    const { container } = render(
      <Field
        helpTooltip="Use um nome que a equipe reconheça rapidamente."
        id="projeto"
        label="Nome do projeto"
      >
        <Input />
      </Field>,
    );

    expect(
      screen.getByRole("button", { name: "Mais informações sobre Nome do projeto" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Nome do projeto")).not.toHaveAttribute("aria-describedby");
    expect(container.querySelector(".clv-field__help")).not.toBeInTheDocument();
  });
});
