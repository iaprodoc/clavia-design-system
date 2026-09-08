import { UserIcon } from "@clavia-ds/icons";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserAccountPopover } from "./UserAccountPopover";

describe("UserAccountPopover", () => {
  const defaultProps = {
    email: "marina.alves@exemplo.com",
    items: [{ icon: <UserIcon />, id: "profile", label: "Meu perfil" }],
    name: "Marina Alves",
  };

  it("abre o menu com a identidade da pessoa e ações nomeadas", () => {
    render(<UserAccountPopover {...defaultProps} />);
    const trigger = screen.getByRole("button", { name: "Abrir menu de Marina Alves" });

    fireEvent.click(trigger);

    const menu = screen.getByRole("menu", { name: "Abrir menu de Marina Alves" });
    expect(menu).toHaveAttribute("aria-label", "Opções da conta de Marina Alves");
    expect(menu).toBeVisible();
    expect(screen.getByText("marina.alves@exemplo.com")).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Meu perfil" })).toBeVisible();
    expect(trigger.querySelector("svg")).toBeInTheDocument();
  });

  it("mantém a saída fora das ações de navegação e dispara seu callback", () => {
    const onSignOut = vi.fn();
    render(<UserAccountPopover {...defaultProps} onSignOut={onSignOut} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu de Marina Alves" }));
    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
