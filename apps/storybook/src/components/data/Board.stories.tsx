import {
  Board,
  BoardAddCardButton,
  BoardCard,
  BoardCardDate,
  BoardColumn,
  Button,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const actionSpy = fn();

const meta = {
  args: {
    children: null,
    label: "Board",
  },
  component: Board,
  parameters: {
    docs: {
      description: {
        component:
          "Estrutura pública para itens com ordem, etapa e responsável. Use quando as colunas forem uma forma estável de leitura; persistência, regras de transição, arraste e dados de domínio continuam no produto. Não use como substituto de tabela para registros comparáveis e buscáveis.",
      },
    },
    layout: "fullscreen",
  },
  subcomponents: { BoardAddCardButton, BoardCard, BoardCardDate, BoardColumn },
  tags: ["autodocs"],
  title: "Componentes/Dados/Board",
} satisfies Meta<typeof Board>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = {
  render: () => (
    <main className="clv-story-board">
      <header className="clv-story-board__intro">
        <p>Exemplo público</p>
        <h1>Pipeline comercial</h1>
        <p>
          Dados fictícios e determinísticos. Cada produto decide seus próprios dados, regras e
          ações.
        </p>
      </header>
      <Board label="Pipeline comercial de exemplo">
        <BoardColumn count={2} markerTone="info" onAddCard={actionSpy} title="Em contato">
          <BoardCard
            assignee={{ name: "Ana Souza" }}
            context="Expansão"
            metadata={<BoardCardDate date="2026-09-12" />}
            onOpen={actionSpy}
            progress={{ label: "Qualificação", value: 60 }}
            status={{ children: "Prioridade alta", status: "warning" }}
            title="Avaliar expansão de agenda"
          />
          <BoardCard
            assignee={{ name: "Marina Costa" }}
            context="Implantação"
            metadata={<BoardCardDate date="2026-09-20" />}
            onOpen={actionSpy}
            progress={{ label: "Qualificação", value: 35 }}
            status={{ children: "Em acompanhamento", status: "info" }}
            title="Confirmar pessoas participantes"
          />
        </BoardColumn>
        <BoardColumn count={1} markerTone="warning" onAddCard={actionSpy} title="Proposta">
          <BoardCard
            assignee={{ name: "Diego Lima" }}
            context="Piloto"
            isOverdue
            metadata={<BoardCardDate date="2026-09-10" />}
            onOpen={actionSpy}
            progress={{ label: "Proposta validada", value: 80 }}
            status={{ children: "Bloqueado", status: "danger", variant: "soft" }}
            title="Revisar escopo do piloto"
          />
        </BoardColumn>
        <BoardColumn count={0} markerTone="success" title="Concluído" />
      </Board>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("region", { name: "Pipeline comercial de exemplo" }),
    ).toBeVisible();
    await expect(canvas.getByText("20 de setembro de 2026").closest("time")).toHaveAttribute(
      "datetime",
      "2026-09-20",
    );
    await userEvent.tab();
    await expect(canvasElement.querySelector<HTMLElement>(".clv-board__scroll")).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Adicionar card a Em contato" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Avaliar expansão de agenda" }));
    await expect(actionSpy).toHaveBeenCalled();
  },
};

export const Estados: Story = {
  render: () => (
    <main className="clv-story-board">
      <Board label="Estados de exemplo">
        <BoardColumn count={0} isLoading markerTone="info" title="Carregando" />
        <BoardColumn
          count={0}
          summary="Ajuste os filtros ou adicione o primeiro item."
          title="Sem itens"
        />
        <BoardColumn count={1} title="Com ação">
          <BoardCard
            action={
              <Button size="xs" variant="secondary">
                Concluir
              </Button>
            }
            context="Acessibilidade"
            metadata="Prazo: sexta-feira"
            title="Verificar os nomes acessíveis dos controles"
          />
        </BoardColumn>
      </Board>
      <section aria-label="Estados da ação de adicionar card" className="clv-story-board__actions">
        <BoardAddCardButton onClick={actionSpy} />
        <BoardAddCardButton disabled label="Adição indisponível" />
        <BoardAddCardButton isLoading label="Adicionando card" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("status", { name: "Carregando itens de Carregando" }),
    ).toBeVisible();
    await expect(canvas.getByText("Nenhum item nesta etapa.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Adição indisponível" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Adicionando card" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};
