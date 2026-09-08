import { ArchiveIcon, TrashIcon } from "@clavia-ds/icons";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu", () => {
  it("abre um menu nomeado e executa sua ação", () => {
    const onAction = vi.fn();
    render(
      <DropdownMenu
        items={[{ id: "edit", label: "Editar", onAction }]}
        label="Ações do projeto"
        trigger="Ações"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ações" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Editar" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("expõe itens desabilitados sem executá-los", () => {
    const onAction = vi.fn();
    render(
      <DropdownMenu
        items={[{ id: "archive", isDisabled: true, label: "Arquivar", onAction }]}
        label="Ações do projeto"
        trigger="Ações"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ações" }));
    const item = screen.getByRole("menuitem", { name: "Arquivar" });
    fireEvent.click(item);

    expect(item).toHaveAttribute("data-disabled");
    expect(onAction).not.toHaveBeenCalled();
  });

  it("renderiza o ícone representativo de cada ação", () => {
    render(
      <DropdownMenu
        items={[{ icon: <ArchiveIcon />, id: "archive", label: "Arquivar" }]}
        label="Ações do projeto"
        trigger="Ações"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ações" }));

    const item = screen.getByRole("menuitem", { name: "Arquivar" });
    expect(item.querySelector(".clv-dropdown-menu__item-icon svg")).toBeInTheDocument();
  });

  it("separa e destaca a primeira ação destrutiva", () => {
    render(
      <DropdownMenu
        items={[
          { id: "edit", label: "Editar" },
          { icon: <TrashIcon />, id: "delete", isDestructive: true, label: "Excluir" },
        ]}
        label="Ações do projeto"
        trigger="Ações"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ações" }));
    const item = screen.getByRole("menuitem", { name: "Excluir" });

    expect(item).toHaveAttribute("data-destructive", "true");
    expect(item).toHaveClass("clv-dropdown-menu__item--destructive");
    expect(item).toHaveClass("clv-dropdown-menu__item--separator-before");
    expect(item).toHaveClass("clv-dropdown-menu__item--first-destructive");
    expect(item.querySelector(".clv-dropdown-menu__item-icon svg")).toBeInTheDocument();
  });

  it("separa uma opção neutra sem tratá-la como destrutiva", () => {
    render(
      <DropdownMenu
        items={[
          { id: "profile", label: "Perfil" },
          { hasSeparatorBefore: true, id: "logout", label: "Sair" },
        ]}
        label="Menu da conta"
        trigger="Conta"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Conta" }));
    const item = screen.getByRole("menuitem", { name: "Sair" });

    expect(item).toHaveClass("clv-dropdown-menu__item--separator-before");
    expect(item).not.toHaveClass("clv-dropdown-menu__item--destructive");
    expect(item).not.toHaveAttribute("data-destructive");
  });

  it("oferece a variante de overflow com três pontos e nome acessível", () => {
    render(
      <DropdownMenu
        items={[{ id: "edit", label: "Editar" }]}
        label="Ações do projeto"
        triggerLabel="Mais ações para o projeto"
        triggerVariant="overflow"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Mais ações para o projeto" });
    expect(trigger).toHaveClass("clv-dropdown-menu__trigger--overflow");
    expect(trigger.querySelector("svg")).toBeInTheDocument();
  });
});
