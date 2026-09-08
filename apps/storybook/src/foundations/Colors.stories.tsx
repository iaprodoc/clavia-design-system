import { CheckIcon, TriangleAlertIcon } from "@clavia-ds/icons";
import { tokens } from "@clavia-ds/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import {
  colorSteps,
  getPrimitiveColorValue,
  getStatusColorValue,
  primitiveColorFamilies,
  semanticColorGroups,
  statusColorFamilies,
  statusColorRoles,
} from "./color-tokens";
import "./colors.css";

type ColorRole = {
  label: string;
  token: string;
  value: string;
};

const staticColors = [
  {
    label: "Branco",
    token: "--clv-color-static-white",
    value: tokens.color.primitive.static.white,
  },
  {
    label: "Preto",
    token: "--clv-color-static-black",
    value: tokens.color.primitive.static.black,
  },
] as const;

const brandColors = [
  {
    label: "Azul de realce",
    token: "--clv-color-primitive-brand-sky",
    value: tokens.color.primitive.brand.sky,
  },
  {
    label: "Azul de apoio",
    token: "--clv-color-primitive-brand-mist",
    value: tokens.color.primitive.brand.mist,
  },
] as const;

type PairingSpec = {
  background: string;
  foreground: string;
  label: string;
  note: string;
  ratio?: string;
};

const validPairings: ReadonlyArray<PairingSpec> = [
  {
    background: "--clv-color-surface-canvas",
    foreground: "--clv-color-text-primary",
    label: "Conteúdo principal",
    note: "text.primary em surface.canvas",
    ratio: "17,62:1",
  },
  {
    background: "--clv-color-action-primary",
    foreground: "--clv-color-text-inverse",
    label: "Ação primária",
    note: "text.inverse em action.primary",
    ratio: "8,47:1",
  },
  {
    background: "--clv-color-accent-secondary",
    foreground: "--clv-color-text-primary",
    label: "Controle selecionado",
    note: "text.primary em accent.secondary",
    ratio: "7,74:1",
  },
  {
    background: "--clv-color-status-success-subtle",
    foreground: "--clv-color-status-success",
    label: "Confirmação",
    note: "status.success em successSubtle",
    ratio: "6,22:1",
  },
  {
    background: "--clv-color-status-warning-subtle",
    foreground: "--clv-color-status-warning",
    label: "Atenção",
    note: "status.warning em warningSubtle",
    ratio: "5,76:1",
  },
  {
    background: "--clv-color-status-info-subtle",
    foreground: "--clv-color-status-info",
    label: "Informação",
    note: "status.info em infoSubtle",
    ratio: "4,77:1",
  },
];

const invalidPairings: ReadonlyArray<PairingSpec> = [
  {
    background: "--clv-color-accent-secondary",
    foreground: "--clv-color-text-inverse",
    label: "Texto branco no acento claro",
    note: "Use text.primary; o branco não atinge AA.",
    ratio: "2,34:1",
  },
  {
    background: "--clv-color-surface-subtle",
    foreground: "--clv-color-text-muted",
    label: "Muted como conteúdo necessário",
    note: "Use text.secondary quando a leitura for necessária.",
    ratio: "4,51:1",
  },
  {
    background: "--clv-color-surface-raised",
    foreground: "--clv-color-text-on-brand",
    label: "Foreground de marca em superfície comum",
    note: "text.onBrand pertence somente às superfícies de marca.",
  },
];

const compatibilityCandidates = [
  "accent.active",
  "status.neutralHover",
  "status.neutralActive",
  "status.successActive",
  "status.warningStrong",
  "status.warningHover",
  "status.warningActive",
  "status.dangerActive",
  "status.infoHover",
  "status.infoActive",
] as const;

function ColorPageIntro({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="clv-color-page__intro">
      <p className="clv-color-page__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function ColorRoleSection({
  description,
  id,
  roles,
  title,
}: {
  description: string;
  id: string;
  roles: ReadonlyArray<ColorRole>;
  title: string;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="clv-color-role" data-testid={id}>
      <header className="clv-color-role__header">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </header>

      <div aria-hidden="true" className="clv-color-role__strip">
        {roles.map((role) => (
          <span key={role.token} style={{ backgroundColor: `var(${role.token})` }} />
        ))}
      </div>

      <div className="clv-color-role__table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Tema claro</th>
              <th scope="col">Papel</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.token}>
                <th scope="row">
                  <code>{role.token}</code>
                </th>
                <td>
                  <span className="clv-color-role__value">
                    <span
                      aria-hidden="true"
                      className="clv-color-role__swatch"
                      style={{ backgroundColor: `var(${role.token})` }}
                    />
                    <code>{role.value.toUpperCase()}</code>
                  </span>
                </td>
                <td>{role.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PairingCard({ pairing, valid }: { pairing: PairingSpec; valid: boolean }) {
  return (
    <article className={`clv-color-pair clv-color-pair--${valid ? "valid" : "invalid"}`}>
      <div
        aria-hidden="true"
        className="clv-color-pair__sample"
        style={{
          backgroundColor: `var(${pairing.background})`,
          color: `var(${pairing.foreground})`,
        }}
      >
        {valid ? "Aa" : <span className="clv-color-pair__invalid-mark" />}
      </div>
      <div className="clv-color-pair__copy">
        <span>{valid ? "Válido" : "Inválido"}</span>
        <strong>{pairing.label}</strong>
        <p>{pairing.note}</p>
        {pairing.ratio ? <code>{pairing.ratio}</code> : null}
      </div>
    </article>
  );
}

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  title: "Visão geral/Fundamentos/Cores",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const EscalasPrimitivas: Story = {
  name: "Escalas primitivas",
  parameters: {
    docs: {
      description: {
        story:
          "As escalas primitivas definem o tema e aparecem com seus valores de referência. Componentes e produtos devem consumir os aliases semânticos, nunca estes nomes visuais diretamente.",
      },
    },
  },
  render: () => (
    <main className="clv-color-page">
      <ColorPageIntro
        description="Cada família vai do tom mais claro ao mais escuro. Os valores são a matéria-prima usada para compor os papéis semânticos da interface."
        eyebrow="Fundamento de cor"
        title="Escalas primitivas"
      />

      <section aria-label="Escalas primitivas" className="clv-color-primitives">
        {primitiveColorFamilies.map((family) => (
          <section
            className="clv-color-primitive"
            data-testid={`primitive-family-${family.token}`}
            key={family.token}
          >
            <h2>{family.label}</h2>
            <div className="clv-color-primitive__scroll">
              <ol className="clv-color-primitive__swatches">
                {colorSteps.map((step) => {
                  const value = getPrimitiveColorValue(family.token, step);

                  return (
                    <li aria-label={`${family.label}, tom ${step}, ${value}`} key={step}>
                      <span
                        aria-hidden="true"
                        className="clv-color-primitive__swatch"
                        data-testid={`primitive-${family.token}-${step}`}
                        style={{
                          backgroundColor: `var(--clv-color-primitive-${family.token}-${step})`,
                        }}
                      />
                      <strong>{step}</strong>
                      <code>{value}</code>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        ))}

        <section className="clv-color-primitive" data-testid="primitive-family-static">
          <h2>Base estática</h2>
          <ol className="clv-color-primitive__base">
            {staticColors.map((color) => (
              <li aria-label={`${color.label}, ${color.value}`} key={color.token}>
                <span
                  aria-hidden="true"
                  className="clv-color-primitive__swatch"
                  style={{ backgroundColor: `var(${color.token})` }}
                />
                <strong>{color.label}</strong>
                <code>{color.value}</code>
              </li>
            ))}
          </ol>
        </section>

        <section className="clv-color-primitive" data-testid="primitive-family-brand">
          <h2>Âncoras de marca</h2>
          <ol className="clv-color-primitive__base">
            {brandColors.map((color) => (
              <li aria-label={`${color.label}, ${color.value}`} key={color.token}>
                <span
                  aria-hidden="true"
                  className="clv-color-primitive__swatch"
                  style={{ backgroundColor: `var(${color.token})` }}
                />
                <strong>{color.label}</strong>
                <code>{color.value}</code>
              </li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primitiveFamilies = canvasElement.querySelectorAll<HTMLElement>(
      '[data-testid^="primitive-family-"]',
    );
    const blueAnchor = canvas.getByTestId("primitive-blue-10");

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Escalas primitivas" }),
    ).toBeVisible();
    await expect(primitiveFamilies).toHaveLength(8);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(76);
    if (!window.matchMedia("(forced-colors: active)").matches) {
      await expect(getComputedStyle(blueAnchor).backgroundColor).toBe("rgb(34, 78, 130)");
    }
    await expect(canvas.getByText("#224E82")).toBeVisible();
    await expect(canvas.getByText("#56B2ED")).toBeVisible();
  },
};

export const CoresSemanticas: Story = {
  name: "Cores semânticas",
  parameters: {
    docs: {
      description: {
        story:
          "Os aliases semânticos conectam intenção e valor no tema claro. A tabela registra o contrato usado pelos componentes; o futuro tema escuro deverá remapear estes mesmos papéis, sem criar nomes paralelos.",
      },
    },
  },
  render: () => (
    <main className="clv-color-page">
      <ColorPageIntro
        description="Papéis funcionais para superfícies, texto, ações, bordas, acento e feedback. Esta versão documenta o tema claro consolidado da Clavia."
        eyebrow="Fundamento de cor"
        title="Cores semânticas"
      />

      <aside aria-label="Tema documentado" className="clv-color-theme-note">
        <span aria-hidden="true" />
        <div>
          <strong>Tema claro</strong>
          <p>Fonte operacional atual · o contrato permanece preparado para temas futuros.</p>
        </div>
      </aside>

      <section aria-label="Papéis semânticos" className="clv-color-roles">
        {semanticColorGroups.map((group) => (
          <ColorRoleSection
            description={group.description}
            id={`semantic-${group.label.toLocaleLowerCase("pt-BR")}`}
            key={group.label}
            roles={group.tokens}
            title={group.label}
          />
        ))}
      </section>

      <section aria-labelledby="feedback-title" className="clv-color-feedback">
        <header className="clv-color-feedback__header">
          <p>Estados funcionais</p>
          <h2 id="feedback-title">Cores de feedback</h2>
          <p>
            Cada família combina texto, fundo, interação e borda. O significado nunca depende apenas
            da cor.
          </p>
        </header>

        <div className="clv-color-roles">
          {statusColorFamilies.map((family) => {
            const roles = statusColorRoles.map((role) => ({
              label: role.label,
              token: `--clv-color-status-${family.token}${role.suffix}`,
              value: getStatusColorValue(family.token, role.suffix),
            }));

            return (
              <ColorRoleSection
                description={`Papéis de ${family.label.toLocaleLowerCase("pt-BR")} para texto, superfícies, interação e contorno.`}
                id={`status-${family.token}`}
                key={family.token}
                roles={roles}
                title={family.label}
              />
            );
          })}
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const semanticGroups = canvasElement.querySelectorAll<HTMLElement>(
      '[data-testid^="semantic-"]',
    );
    const statusGroups = canvasElement.querySelectorAll<HTMLElement>('[data-testid^="status-"]');
    const primaryAction = canvasElement.querySelector<HTMLElement>(
      '[data-testid="semantic-ações"] .clv-color-role__swatch',
    );

    if (!primaryAction) {
      throw new Error("Amostra da ação primária não encontrada.");
    }

    await expect(canvas.getByRole("heading", { level: 1, name: "Cores semânticas" })).toBeVisible();
    await expect(canvas.getByText("Tema claro", { selector: "strong" })).toBeVisible();
    await expect(semanticGroups).toHaveLength(6);
    await expect(statusGroups).toHaveLength(5);
    await expect(getComputedStyle(primaryAction).backgroundColor).toBe("rgb(34, 78, 130)");
    await expect(
      canvas.getByRole("heading", { level: 2, name: "Cores de feedback" }),
    ).toBeVisible();
  },
};

export const CamadasEPareamentos: Story = {
  name: "Camadas e pareamentos",
  parameters: {
    docs: {
      description: {
        story:
          "A hierarquia usa cinco superfícies funcionais e elevação separada. A matriz mostra combinações aprovadas e antiusos que continuam tecnicamente possíveis, mas não pertencem ao contrato.",
      },
    },
  },
  render: () => (
    <main className="clv-color-page">
      <ColorPageIntro
        description="Superfície, foreground e borda precisam formar uma relação legível. A escolha de um token isolado não garante que a composição seja válida."
        eyebrow="Contrato de composição"
        title="Camadas e pareamentos"
      />

      <section aria-labelledby="layering-title" className="clv-color-foundation-section">
        <header className="clv-color-role__header">
          <h2 id="layering-title">Hierarquia de superfícies</h2>
          <p>
            Canvas sustenta a página; raised recebe conteúdo; subtle agrupa; sunken indica um plano
            rebaixado. Inverse fica reservado a contextos funcionais escuros, como Tooltip.
          </p>
        </header>

        <div className="clv-color-layering" data-testid="color-layering">
          <div className="clv-color-layer clv-color-layer--canvas">
            <code>surface.canvas</code>
            <div className="clv-color-layer clv-color-layer--raised">
              <code>surface.raised + elevation.raised</code>
              <div className="clv-color-layer clv-color-layer--subtle">
                <code>surface.subtle</code>
                <div className="clv-color-layer clv-color-layer--sunken">
                  <code>surface.sunken</code>
                </div>
              </div>
            </div>
          </div>
          <aside className="clv-color-layer clv-color-layer--inverse">
            <code>surface.inverse + text.inverse</code>
            <p>Contexto escuro funcional, não um tema Dark.</p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="valid-pairings-title" className="clv-color-foundation-section">
        <header className="clv-color-role__header">
          <h2 id="valid-pairings-title">Pairings válidos</h2>
          <p>Combinações usadas por conteúdo, ações, seleção e feedback no tema claro.</p>
        </header>
        <div className="clv-color-pair-grid" data-testid="valid-pairings">
          {validPairings.map((pairing) => (
            <PairingCard key={pairing.label} pairing={pairing} valid />
          ))}
        </div>
      </section>

      <section aria-labelledby="invalid-pairings-title" className="clv-color-foundation-section">
        <header className="clv-color-role__header">
          <h2 id="invalid-pairings-title">Pairings inválidos</h2>
          <p>
            As amostras são decorativas e estão ocultas da árvore acessível; o texto ao lado explica
            a correção esperada.
          </p>
        </header>
        <div className="clv-color-pair-grid" data-testid="invalid-pairings">
          {invalidPairings.map((pairing) => (
            <PairingCard key={pairing.label} pairing={pairing} valid={false} />
          ))}
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Camadas e pareamentos" }),
    ).toBeVisible();
    await expect(within(canvas.getByTestId("valid-pairings")).getAllByRole("article")).toHaveLength(
      6,
    );
    await expect(
      within(canvas.getByTestId("invalid-pairings")).getAllByRole("article"),
    ).toHaveLength(3);
    await expect(canvas.getByText("surface.inverse + text.inverse")).toBeVisible();
  },
};

export const ProdutoExpressaoECompatibilidade: Story = {
  name: "Produto, expressão e compatibilidade",
  parameters: {
    docs: {
      description: {
        story:
          "Exemplos fictícios de jornada guiada e operação densa mostram o mesmo contrato em densidades diferentes. A camada expressiva fica separada das superfícies críticas, e os aliases mantidos por compatibilidade permanecem visíveis.",
      },
    },
  },
  render: () => (
    <main className="clv-color-page">
      <ColorPageIntro
        description="Os produtos digitais compartilham aliases semânticos sem depender do framework de estilos. O primeiro ciclo publica somente Light e mantém efeitos pesados fora das tarefas críticas."
        eyebrow="Aplicação do contrato"
        title="Produto, expressão e compatibilidade"
      />

      <section aria-labelledby="states-title" className="clv-color-foundation-section">
        <header className="clv-color-role__header">
          <h2 id="states-title">Ação, foco e indisponibilidade</h2>
          <p>O foco tem papel próprio; disabled combina cor, atributo e redução de ênfase.</p>
        </header>
        <div className="clv-color-state-grid">
          <button className="clv-color-action clv-color-action--default" type="button">
            Padrão
          </button>
          <button className="clv-color-action clv-color-action--hover" type="button">
            Hover
          </button>
          <button className="clv-color-action clv-color-action--active" type="button">
            Active
          </button>
          <button
            className="clv-color-action clv-color-action--focus"
            data-testid="focus-example"
            type="button"
          >
            Foco visível
          </button>
          <button className="clv-color-action" disabled type="button">
            Indisponível
          </button>
        </div>
      </section>

      <section aria-label="Exemplos de produto" className="clv-color-product-grid">
        <article className="clv-color-product clv-color-product--app">
          <header>
            <span>Jornada guiada · viewport compacto</span>
            <h2>Dados da clínica</h2>
            <p>Superfícies sólidas mantêm o formulário legível e previsível.</p>
          </header>
          <label htmlFor="color-demo-name">Nome de exibição</label>
          <input defaultValue="Clínica Horizonte" id="color-demo-name" readOnly />
          <p className="clv-color-product__help">Este nome aparecerá para a equipe.</p>
          <div className="clv-color-product__error" role="status">
            <strong>Revise o telefone.</strong>
            <span>Inclua o DDD antes de avançar.</span>
          </div>
          <button className="clv-color-action clv-color-action--default" type="button">
            Salvar e continuar
          </button>
        </article>

        <article className="clv-color-product clv-color-product--hub">
          <header>
            <span>Operação · composição densa</span>
            <h2>Operação de projetos</h2>
            <p>Texto, borda e rótulo tornam o status identificável sem depender só da cor.</p>
          </header>
          <table className="clv-color-demo-table">
            <caption>Projetos fictícios</caption>
            <thead>
              <tr>
                <th scope="col">Projeto</th>
                <th scope="col">Status</th>
                <th scope="col">Atualização</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Jornada inicial</th>
                <td>
                  <span className="clv-color-status clv-color-status--success">
                    <CheckIcon aria-hidden="true" /> Concluído
                  </span>
                </td>
                <td>Hoje, 09:20</td>
              </tr>
              <tr>
                <th scope="row">Cadastro da equipe</th>
                <td>
                  <span className="clv-color-status clv-color-status--warning">
                    <TriangleAlertIcon aria-hidden="true" /> Requer atenção
                  </span>
                </td>
                <td>Ontem, 16:45</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>

      <section aria-labelledby="expression-title" className="clv-color-foundation-section">
        <header className="clv-color-role__header">
          <h2 id="expression-title">Produto sólido, expressão delimitada</h2>
          <p>
            Vidro, blur, glow e gradiente aparecem somente em superfícies de marca aprovadas. Form,
            Table, Alert e StatusBadge permanecem sólidos.
          </p>
        </header>
        <div className="clv-color-expression-grid">
          <article className="clv-color-operational-example">
            <span>Operacional</span>
            <strong>Conteúdo crítico em superfície sólida</strong>
            <p>Canvas, raised, borda e texto sem depender do fundo externo.</p>
          </article>
          <article className="clv-color-brand-example">
            <span>Expressivo</span>
            <strong>Superfície de marca aprovada</strong>
            <p>Texto onBrand validado no próprio contexto.</p>
            <button type="button">Conhecer a Clavia</button>
          </article>
        </div>
      </section>

      <section aria-label="Compatibilidade e distribuição" className="clv-color-governance-grid">
        <article>
          <h2>Aliases mantidos por compatibilidade</h2>
          <p>
            Estes nomes continuam publicados, mas não devem ganhar novos usos sem evidência em um
            contexto compartilhado.
          </p>
          <ul data-testid="compatibility-candidates">
            {compatibilityCandidates.map((token) => (
              <li key={token}>
                <code>{token}</code>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Distribuição dos tokens</h2>
          <dl>
            <div>
              <dt>Tema publicado</dt>
              <dd>Light</dd>
            </div>
            <div>
              <dt>Exportação prevista</dt>
              <dd>150 cores fundacionais, aliases, scopes e code syntax.</dd>
            </div>
            <div>
              <dt>Fora deste ciclo</dt>
              <dd>Dark mode, paletas alpha completas e nomes paralelos.</dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const focusExample = canvas.getByTestId("focus-example");
    const candidates = within(canvas.getByTestId("compatibility-candidates")).getAllByRole(
      "listitem",
    );

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Produto, expressão e compatibilidade" }),
    ).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 2, name: "Dados da clínica" })).toBeVisible();
    await expect(
      canvas.getByRole("heading", { level: 2, name: "Operação de projetos" }),
    ).toBeVisible();
    await expect(getComputedStyle(focusExample).boxShadow).toContain("rgba(34, 78, 130, 0.28)");
    await expect(candidates).toHaveLength(10);
    await expect(canvas.getByText("Light", { selector: "dd" })).toBeVisible();
  },
};
