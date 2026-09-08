import { Alert, Button, StatusBadge } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const onDismiss = fn();

const meta = {
  args: {
    children: "Funciona apenas com WhatsApp Business.",
    status: "danger",
    title: "Método não compatível",
  },
  component: Alert,
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "100%", maxInlineSize: "72rem" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Mensagem contextual persistente. `inline` segue uma anatomia fixa: indicador à esquerda, título e descrição empilhados no conteúdo e ação ou fechamento à direita. O status semântico colore o indicador, o título e o `Button primary` que conclui aquele feedback; a superfície permanece neutra. Variantes de botão explicitamente escolhidas, como `surface` e `secondary`, preservam sua própria hierarquia. `sm` é a versão compacta de uma linha e pode conter apenas título e fechamento. Use `featured` como padrão primário para avisos de página que tenham metadados, dispensa, CTA em área própria ou texto explicativo. Sua superfície persistente usa `elevation.lifted`; o Alert `inline` permanece em `elevation.raised`. Para sinais locais e curtos, use OperationalAlert. Use SaveStatus para salvamento e Toast para confirmações transitórias; não use Alert como rótulo curto, substituto de erro de campo ou confirmação crítica.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/Alert",
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Aviso: Story = {
  name: "Aviso",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Funciona apenas com WhatsApp Business.",
    );
    await expect(canvasElement.querySelector(".clv-alert__icon svg")).toBeVisible();
  },
};

export const Estados: Story = {
  name: "Estados semânticos",
  render: () => (
    <div className="clv-story-stack clv-story-alert-stack">
      <Alert status="info" title="Informação">
        Use o aplicativo oficial para continuar com a integração.
      </Alert>
      <Alert status="success" title="Conexão concluída">
        O canal de teste já pode receber mensagens.
      </Alert>
      <Alert status="warning" title="Atenção">
        A sessão de conexão expira em alguns minutos.
      </Alert>
      <Alert status="danger" title="Ação necessária">
        Atualize o aplicativo para usar este método.
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const alerts = canvasElement.querySelectorAll(".clv-alert");

    await expect(alerts).toHaveLength(4);
    await expect(within(canvasElement).getByRole("status", { name: "Informação" })).toBeVisible();
    await expect(
      within(canvasElement).getByRole("alert", { name: "Ação necessária" }),
    ).toBeVisible();
    await expect(alerts[0]).toHaveClass("clv-alert--inline");
    await expect(getComputedStyle(alerts[0] as HTMLElement).backgroundColor).toBe(
      "rgb(255, 255, 255)",
    );
    await expect(alerts[0]?.querySelector(".clv-alert__content strong")).toHaveTextContent(
      "Informação",
    );
    await expect(alerts[0]?.querySelector(".clv-alert__message")).toHaveClass("clv-alert__message");
  },
};

export const Compacto: Story = {
  name: "Compacto",
  render: () => (
    <Alert onDismiss={onDismiss} size="sm" status="success" title="Perfil atualizado" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("status", { name: "Perfil atualizado" });

    await expect(alert).toHaveClass("clv-alert--size-sm");
    await expect(alert.children[0]).toHaveClass("clv-alert__icon");
    await expect(alert.children[1]).toHaveClass("clv-alert__content");
    await expect(alert.querySelector(".clv-alert__message")).not.toBeInTheDocument();
    const dismiss = canvas.getByRole("button", { name: "Fechar alerta" });
    const dismissIcon = dismiss.querySelector("svg");

    await expect(dismiss).toBeVisible();
    await expect(dismissIcon).not.toBeNull();
    await expect(getComputedStyle(dismissIcon as SVGElement).blockSize).toBe("12px");
  },
};

export const AcaoInline: Story = {
  args: {
    actions: <Button size="xs">Atualizar</Button>,
    children:
      "Uma nova versão está pronta para uso. Ela inclui ajustes de estabilidade e melhorias de acessibilidade para que a equipe continue o trabalho sem interromper o fluxo em andamento.",
    status: "info",
    title: "Atualização disponível",
  },
  name: "Ação inline",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("status", { name: "Atualização disponível" });

    await expect(alert.children[0]).toHaveClass("clv-alert__icon");
    await expect(alert.children[1]).toHaveClass("clv-alert__content");
    const action = canvas.getByRole("button", { name: "Atualizar" });
    const content = alert.querySelector(".clv-alert__content");

    await expect(action).toBeVisible();
    if (!content) throw new Error("O alerta inline deve renderizar conteúdo.");
    await expect(
      Math.abs(action.getBoundingClientRect().top - content.getBoundingClientRect().top),
    ).toBeLessThanOrEqual(1);
  },
};

export const AcaoAuxiliarInline: Story = {
  name: "Ação auxiliar inline",
  args: {
    actions: (
      <Button size="xs" variant="surface">
        Ver recibo
      </Button>
    ),
    children: "O comprovante já está disponível para consulta.",
    status: "success",
    title: "Pagamento confirmado",
  },
};

export const AcoesSemanticasInline: Story = {
  name: "Ações semânticas inline",
  render: () => (
    <div className="clv-story-stack clv-story-alert-stack">
      <Alert
        actions={<Button size="xs">Atualizar</Button>}
        status="info"
        title="Atualização disponível"
      >
        Uma nova versão está pronta para uso.
      </Alert>
      <Alert
        actions={<Button size="xs">Ver comprovante</Button>}
        status="success"
        title="Pagamento confirmado"
      >
        O comprovante já está disponível para consulta.
      </Alert>
      <Alert
        actions={<Button size="xs">Revisar agora</Button>}
        status="warning"
        title="Atenção necessária"
      >
        A sessão expira em alguns minutos.
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const successAlert = canvas.getByRole("status", { name: "Pagamento confirmado" });
    const successTitle = successAlert.querySelector("strong");
    const successAction = canvas.getByRole("button", { name: "Ver comprovante" });

    if (!successTitle) throw new Error("O alerta semântico deve renderizar título.");
    await expect(getComputedStyle(successAction).backgroundColor).toBe(
      getComputedStyle(successTitle).color,
    );
  },
};

export const Destacado: Story = {
  name: "Destacado com contexto e ação",
  args: {
    actions: (
      <Button size="sm" variant="outline">
        Ver atendimento
      </Button>
    ),
    children: "O cadastro foi validado e está pronto para a próxima etapa.",
    metadata: (
      <>
        <StatusBadge>Paciente: Ana Souza</StatusBadge>
        <StatusBadge>Consulta · 14:30</StatusBadge>
      </>
    ),
    onDismiss,
    status: "success",
    title: "Tudo certo",
    variant: "featured",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("status", { name: "Tudo certo" });
    const dismiss = canvas.getByRole("button", { name: "Fechar alerta" });

    onDismiss.mockClear();
    await expect(alert).toHaveClass("clv-alert--featured");
    await expect(getComputedStyle(alert).boxShadow).toBe("rgba(2, 24, 38, 0.08) 0px 4px 12px 0px");
    await expect(canvas.getByText("Paciente: Ana Souza")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Ver atendimento" })).toBeVisible();
    await userEvent.click(dismiss);
    await expect(onDismiss).toHaveBeenCalledOnce();
  },
};

export const DestacadosSemanticos: Story = {
  name: "Destacados semânticos",
  render: () => (
    <div className="clv-story-stack">
      <Alert
        actions={
          <Button size="sm" variant="outline">
            Ver atendimento
          </Button>
        }
        metadata={<StatusBadge>Paciente: Ana Souza</StatusBadge>}
        status="info"
        title="Atendimento atualizado"
        variant="featured"
      >
        A consulta foi confirmada e já está disponível na agenda da clínica.
      </Alert>
      <Alert
        actions={
          <Button size="sm" variant="outline">
            Continuar onboarding
          </Button>
        }
        metadata={<StatusBadge>Etapa 3 de 3</StatusBadge>}
        status="success"
        title="Tudo certo"
        variant="featured"
      >
        O cadastro foi validado e está pronto para a próxima etapa.
      </Alert>
      <Alert
        actions={
          <Button size="sm" variant="outline">
            Revisar dados
          </Button>
        }
        metadata={<StatusBadge>Consulta · 14:30</StatusBadge>}
        status="warning"
        title="Revisão necessária"
        variant="featured"
      >
        Ainda faltam informações para confirmar este atendimento.
      </Alert>
      <Alert
        actions={
          <Button size="sm" variant="outline">
            Corrigir cadastro
          </Button>
        }
        metadata={<StatusBadge>Consulta · cadastro incompleto</StatusBadge>}
        status="danger"
        title="Ação necessária"
        variant="featured"
      >
        Não foi possível validar os dados necessários para o atendimento.
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("status", { name: "Atendimento atualizado" })).toBeVisible();
    await expect(canvas.getByRole("status", { name: "Tudo certo" })).toBeVisible();
    await expect(canvas.getByRole("alert", { name: "Revisão necessária" })).toBeVisible();
    await expect(canvas.getByRole("alert", { name: "Ação necessária" })).toBeVisible();
    await expect(canvasElement.querySelectorAll(".clv-alert--featured")).toHaveLength(4);
  },
};
