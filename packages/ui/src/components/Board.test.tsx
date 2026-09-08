import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Board, BoardAddCardButton, BoardCard, BoardCardDate, BoardColumn } from "./Board";

describe("Board", () => {
  it("expõe uma região nomeada, etapas e as ações críticas", () => {
    const onAddCard = vi.fn();
    const onOpen = vi.fn();

    render(
      <Board label="Pipeline de exemplo">
        <BoardColumn count={1} onAddCard={onAddCard} title="Em contato">
          <BoardCard onOpen={onOpen} title="Revisar proposta" />
        </BoardColumn>
      </Board>,
    );

    expect(screen.getByRole("region", { name: "Pipeline de exemplo" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Em contato" })).toBeVisible();
    screen.getByRole("button", { name: "Adicionar card a Em contato" }).click();
    screen.getByRole("button", { name: "Revisar proposta" }).click();
    expect(onAddCard).toHaveBeenCalledOnce();
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("representa carregamento, vazio e datas com semântica acessível", () => {
    render(
      <>
        <Board label="Carregando pipeline">
          <BoardColumn count={0} isLoading title="Triagem" />
          <BoardColumn count={0} title="Concluído" />
        </Board>
        <BoardCardDate date="2026-09-20" />
        <BoardAddCardButton isLoading label="Adicionando card" />
      </>,
    );

    expect(screen.getByRole("status", { name: "Carregando itens de Triagem" })).toBeVisible();
    expect(screen.getByText("Nenhum item nesta etapa.")).toBeVisible();
    expect(screen.getByText("20 de setembro de 2026").closest("time")).toHaveAttribute(
      "datetime",
      "2026-09-20",
    );
    expect(screen.getByRole("button", { name: "Adicionando card" })).toBeDisabled();
  });
});
