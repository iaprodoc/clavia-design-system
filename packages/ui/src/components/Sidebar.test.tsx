import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("abre pelo teclado, move o foco e retorna ao gatilho ao fechar", async () => {
    render(
      <Sidebar>
        <a href="/projetos">Projetos</a>
      </Sidebar>,
    );

    const trigger = screen.getByRole("button", { name: "Abrir navegação" });
    trigger.focus();
    expect(trigger).toHaveFocus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(document.querySelector(".clv-sidebar__content")).toHaveFocus());

    fireEvent.click(document.querySelector(".clv-sidebar__backdrop") as HTMLElement);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("notifica alterações quando o estado é controlado", () => {
    const onOpenChange = vi.fn();
    render(
      <Sidebar onOpenChange={onOpenChange} open={false}>
        Projetos
      </Sidebar>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir navegação" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("recolhe a navegação desktop e alterna o nome do controle", () => {
    const onCollapsedChange = vi.fn();
    render(
      <Sidebar collapsedHeader={<span>Marca compacta</span>} onCollapsedChange={onCollapsedChange}>
        Projetos
      </Sidebar>,
    );

    const sidebar = document.querySelector(".clv-sidebar");
    fireEvent.click(screen.getByRole("button", { name: "Recolher navegação" }));

    expect(sidebar).toHaveAttribute("data-collapsed", "true");
    expect(screen.getByRole("button", { name: "Expandir navegação" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("Marca compacta")).toBeInTheDocument();
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("respeita o estado recolhido controlado", () => {
    const onCollapsedChange = vi.fn();
    render(
      <Sidebar collapsed onCollapsedChange={onCollapsedChange}>
        Projetos
      </Sidebar>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Expandir navegação" }));

    expect(document.querySelector(".clv-sidebar")).toHaveAttribute("data-collapsed", "true");
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
  });

  it("preserva foco e fechamento quando o produto controla a abertura", async () => {
    function ControlledSidebar() {
      const [open, setOpen] = useState(false);

      return (
        <Sidebar onOpenChange={setOpen} open={open}>
          <a href="/projetos">Projetos</a>
        </Sidebar>
      );
    }

    render(<ControlledSidebar />);

    const trigger = screen.getByRole("button", { name: "Abrir navegação" });
    fireEvent.click(trigger);

    const sidebar = document.querySelector(".clv-sidebar__content") as HTMLElement;
    await waitFor(() => expect(sidebar).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "Fechar navegação" }));
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("fecha a navegação compacta com Escape e devolve o foco ao gatilho", async () => {
    render(
      <Sidebar>
        <a href="/projetos">Projetos</a>
      </Sidebar>,
    );

    const trigger = screen.getByRole("button", { name: "Abrir navegação" });
    fireEvent.click(trigger);

    const sidebar = document.querySelector(".clv-sidebar__content") as HTMLElement;
    await waitFor(() => expect(sidebar).toHaveFocus());
    fireEvent.keyDown(sidebar, { key: "Escape" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("fecha pelo backdrop e não deixa o foco escapar da região compacta", async () => {
    render(
      <Sidebar>
        <a href="/projetos">Projetos</a>
      </Sidebar>,
    );

    const trigger = screen.getByRole("button", { name: "Abrir navegação" });
    fireEvent.click(trigger);

    const sidebar = document.querySelector(".clv-sidebar__content") as HTMLElement;
    await waitFor(() => expect(sidebar).toHaveFocus());

    fireEvent.keyDown(sidebar, { key: "Tab" });
    expect(screen.getByRole("button", { name: "Fechar navegação" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Fechar navegação" }));
    expect(trigger).toHaveFocus();
  });

  it("mantém o backdrop fora da árvore acessível e da ordem de foco", () => {
    render(<Sidebar open>Projetos</Sidebar>);

    const backdrop = document.querySelector(".clv-sidebar__backdrop");
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop).toHaveAttribute("role", "presentation");
    expect(backdrop).not.toHaveAttribute("tabindex");
  });

  it("separa cabeçalho, navegação rolável e rodapé", () => {
    render(
      <Sidebar description="Operação" footer={<button type="button">Minha conta</button>}>
        <a href="/projetos">Projetos</a>
      </Sidebar>,
    );

    expect(screen.getByText("Operação")).toHaveClass("clv-sidebar__description");
    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toHaveClass(
      "clv-sidebar__navigation",
    );
    expect(screen.getByRole("button", { name: "Minha conta" }).parentElement).toHaveClass(
      "clv-sidebar__footer",
    );
  });

  it("bloqueia a rolagem da página enquanto o drawer compacto está aberto", () => {
    const { rerender } = render(<Sidebar open>Projetos</Sidebar>);

    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Sidebar open={false}>Projetos</Sidebar>);
    expect(document.body.style.overflow).toBe("");
  });
});
