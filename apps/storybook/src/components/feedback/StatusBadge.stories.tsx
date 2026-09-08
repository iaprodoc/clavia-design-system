import { ChevronRightIcon } from "@clavia-ds/icons";
import { StatusBadge, StatusBadgeCheckIcon } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  args: {
    children: "Em andamento",
    size: "sm",
    status: "info",
    variant: "outline",
  },
  component: StatusBadge,
  parameters: {
    docs: {
      description: {
        component:
          "Rótulo curto para estados operacionais. A anatomia usa os tokens semânticos, a tipografia Sora e o raio da Clavia. Use `xs` para estados inline muito curtos, como uma etapa concluída ao lado do título; o texto precisa continuar compreensível sem a cor. Não use para ações, métricas ou mensagens longas.",
      },
    },
  },
  tags: ["autodocs"],
  title: "Componentes/Feedback/StatusBadge",
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

const statuses = [
  { label: "Rascunho", status: "neutral" },
  { label: "Em andamento", status: "info" },
  { label: "Ativo", status: "success" },
  { label: "Atenção necessária", status: "warning" },
  { label: "Falha de conexão", status: "danger" },
] as const;

const variants = [
  { label: "Sólido", variant: "solid" },
  { label: "Suave", variant: "soft" },
  { label: "Contorno", variant: "outline" },
] as const;

export const Padrao: Story = { name: "Padrão" };

export const MatrizSemantica: Story = {
  name: "Matriz semântica",
  render: () => (
    <div className="clv-story-grid clv-story-status-badge-matrix">
      {variants.map((item) => (
        <section className="clv-story-panel" key={item.variant}>
          <h2>{item.label}</h2>
          <div className="clv-story-stack">
            {statuses.map((status) => (
              <StatusBadge
                key={`${item.variant}-${status.status}`}
                status={status.status}
                variant={item.variant}
              >
                {status.label}
              </StatusBadge>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll(".clv-status-badge");

    await expect(badges).toHaveLength(15);

    for (const badge of badges) {
      const style = getComputedStyle(badge);

      await expect(style.borderRadius).toBe("999px");
      await expect(style.fontWeight).toBe(
        badge.classList.contains("clv-status-badge--solid") ? "400" : "500",
      );
    }
  },
};

export const TamanhosEIcones: Story = {
  name: "Tamanhos e ícones",
  render: () => (
    <div className="clv-story-stack">
      <StatusBadge size="xs" status="success" variant="soft">
        Extra pequeno · 20 px
      </StatusBadge>
      <StatusBadge
        leadingIcon={<StatusBadgeCheckIcon />}
        size="md"
        status="success"
        trailingIcon={<ChevronRightIcon />}
        variant="soft"
      >
        Médio · 28 px
      </StatusBadge>
      <StatusBadge
        leadingIcon={<StatusBadgeCheckIcon />}
        status="success"
        trailingIcon={<ChevronRightIcon />}
        variant="soft"
      >
        Pequeno · 24 px
      </StatusBadge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const extraSmall = canvas
      .getByText("Extra pequeno · 20 px")
      .closest<HTMLElement>(".clv-status-badge");
    const medium = canvas.getByText("Médio · 28 px").closest<HTMLElement>(".clv-status-badge");
    const small = canvas.getByText("Pequeno · 24 px").closest<HTMLElement>(".clv-status-badge");

    if (!extraSmall || !medium || !small) {
      throw new Error("Tamanhos do StatusBadge não encontrados.");
    }

    await expect(extraSmall.getBoundingClientRect().height).toBe(20);
    await expect(medium.getBoundingClientRect().height).toBe(28);
    await expect(small.getBoundingClientRect().height).toBe(24);
    await expect(getComputedStyle(medium).paddingLeft).toBe("8px");
    await expect(getComputedStyle(medium).paddingRight).toBe("12px");
    await expect(getComputedStyle(small).paddingLeft).toBe("8px");
    await expect(getComputedStyle(small).paddingRight).toBe("12px");
    await expect(medium.querySelectorAll(".clv-status-badge__icon")).toHaveLength(2);
    await expect(small.querySelectorAll(".clv-status-badge__icon")).toHaveLength(2);
    await expect(medium.querySelector(".clv-status-badge__check-icon")).toBeInTheDocument();
    await expect(small.querySelector(".clv-status-badge__check-icon")).toBeInTheDocument();
  },
};

export const UsoSemantico: Story = {
  name: "Uso semântico",
  render: () => (
    <div className="clv-story-stack">
      <StatusBadge leadingIcon={<StatusBadgeCheckIcon />} status="success" variant="solid">
        Integração concluída
      </StatusBadge>
      <StatusBadge status="warning" variant="soft">
        Revisão necessária
      </StatusBadge>
      <StatusBadge status="danger" variant="outline">
        Sincronização interrompida
      </StatusBadge>
    </div>
  ),
};
