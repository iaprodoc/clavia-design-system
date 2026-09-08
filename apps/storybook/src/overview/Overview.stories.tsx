import { ClaviaIcon } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import "./overview.css";
import { catalogStats } from "./catalog-stats.generated";
import { latestUpdate, latestUpdates } from "./recent-updates.generated";

const meta = {
  title: "Visão geral/Introdução",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const navigationItems = [
  {
    description:
      "Cores, tipografia, iconografia, espaçamento e demais regras que sustentam a interface.",
    eyebrow: "01",
    href: "/?path=/story/vis%C3%A3o-geral-fundamentos-cores--cores-semanticas",
    title: "Fundamentos",
  },
  {
    description: "Contratos públicos, variantes, estados, comportamento e orientações de uso.",
    eyebrow: "02",
    href: "/?path=/docs/componentes-a%C3%A7%C3%B5es-button--docs",
    title: "Componentes",
  },
  {
    description:
      "Três cenários controlados para validar a aplicação do sistema em contextos reais.",
    eyebrow: "03",
    href: "/?path=/story/composi%C3%A7%C3%B5es-hub-vis%C3%A3o-operacional--sucesso",
    title: "Composições",
  },
] as const;

const compositions = [
  {
    href: "/?path=/story/composi%C3%A7%C3%B5es-hub-vis%C3%A3o-operacional--sucesso",
    product: "Hub",
    title: "Visão operacional",
  },
  {
    href: "/?path=/story/composi%C3%A7%C3%B5es-hub-inspe%C3%A7%C3%A3o-de-conversas--sucesso",
    product: "Hub",
    title: "Inspeção de conversas",
  },
  {
    href: "/?path=/story/composi%C3%A7%C3%B5es-hub-pessoas-e-acessos--sucesso",
    product: "Hub",
    title: "Pessoas e acessos",
  },
] as const;

const pendingComponentReviews = [
  {
    category: "Feedback",
    components: "InlineBanner, OperationalAlert e Toast",
  },
  {
    category: "Navegação",
    components: "Tabs",
  },
  {
    category: "Layout",
    components: "AppShell, BrandPanel, Section e Sidebar",
  },
  {
    category: "Dados",
    components: "ActionCard, FilterBar e FilterDialog",
  },
] as const;

export const Fundacao: Story = {
  name: "Comece aqui",
  render: () => (
    <main className="clv-overview">
      <header className="clv-overview__hero">
        <div className="clv-overview__identity">
          <ClaviaIcon aria-hidden="true" size={32} />
          <span>Clavia Design System</span>
        </div>

        <div className="clv-overview__hero-copy">
          <p className="clv-overview__eyebrow">Fonte operacional compartilhada</p>
          <h1>Uma base consistente para o App e o Hub.</h1>
          <p className="clv-overview__lead">
            Este Storybook reúne os fundamentos, componentes e regras de uso aprovados para os
            produtos digitais da Clavia. Ele também registra como essas decisões se comportam em
            três composições de validação.
          </p>
        </div>

        <dl className="clv-overview__scope" aria-label="Escopo desta entrega">
          <div>
            <dt>Produtos</dt>
            <dd>App e Hub</dd>
          </div>
          <div>
            <dt>Tema</dt>
            <dd>Claro</dd>
          </div>
          <div>
            <dt>Referência</dt>
            <dd>Storybook</dd>
          </div>
        </dl>
      </header>

      <section className="clv-overview__updates" aria-labelledby="clv-overview-updates">
        <div className="clv-overview__updates-intro">
          <p className="clv-overview__eyebrow">Acompanhamento da entrega</p>
          <h2 id="clv-overview-updates">Atualização mais recente</h2>
          <p>
            Este resumo registra as melhorias mais recentes disponibilizadas nesta fonte
            compartilhada.
          </p>

          <dl className="clv-overview__update-meta" aria-label="Detalhes da atualização">
            <div>
              <dt>Atualizado em</dt>
              <dd>{latestUpdate.date}</dd>
            </div>
            <div>
              <dt>Responsável</dt>
              <dd>Clavia Design System</dd>
            </div>
            <div>
              <dt>Componentes</dt>
              <dd>{catalogStats.components} publicados</dd>
            </div>
            <div>
              <dt>Fundações</dt>
              <dd>11 documentadas</dd>
            </div>
            <div>
              <dt>Variações</dt>
              <dd>{catalogStats.variations} documentadas</dd>
            </div>
            <div>
              <dt>Revisões</dt>
              <dd>11 pendentes</dd>
            </div>
          </dl>
        </div>

        <div className="clv-overview__update-summary">
          <p className="clv-overview__eyebrow">O que mudou</p>
          <ul>
            {latestUpdates.map((update) => (
              <li key={update.title}>
                <span aria-hidden="true" className="clv-overview__update-arrow">
                  →
                </span>
                <span className="clv-overview__update-content">
                  <strong>{update.title}</strong>
                  <span className="clv-overview__update-date">{update.date}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <section className="clv-overview__pending-reviews" aria-labelledby="clv-overview-pending">
          <div className="clv-overview__pending-reviews-heading">
            <div>
              <p className="clv-overview__eyebrow">Próxima frente</p>
              <h3 id="clv-overview-pending">11 componentes aguardam revisão</h3>
            </div>
            <p>Variantes e ajustes pontuais seguem em andamento.</p>
          </div>

          <ul aria-label="Componentes aguardando revisão">
            {pendingComponentReviews.map((review) => (
              <li key={review.category}>
                <strong>{review.category}</strong>
                <span>{review.components}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="clv-overview__section" aria-labelledby="clv-overview-navigation">
        <div className="clv-overview__section-heading">
          <p className="clv-overview__eyebrow">Como navegar</p>
          <h2 id="clv-overview-navigation">Encontre a informação pelo nível de decisão.</h2>
          <p>
            Comece pelos fundamentos, consulte o contrato de cada componente e use as composições
            para observar o sistema em contexto.
          </p>
        </div>

        <nav className="clv-overview__navigation" aria-label="Áreas do Design System">
          {navigationItems.map((item) => (
            <a
              className="clv-overview__navigation-card"
              href={item.href}
              key={item.title}
              target="_top"
            >
              <span className="clv-overview__navigation-number">{item.eyebrow}</span>
              <span className="clv-overview__navigation-copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
              <span className="clv-overview__navigation-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </nav>
      </section>

      <section className="clv-overview__section" aria-labelledby="clv-overview-compositions">
        <div className="clv-overview__section-heading clv-overview__section-heading--compact">
          <p className="clv-overview__eyebrow">Recorte de validação</p>
          <h2 id="clv-overview-compositions">Três composições para testar o sistema.</h2>
          <p>
            Esses cenários verificam hierarquia, responsividade, estados e interação. Eles não
            substituem as telas completas dos produtos.
          </p>
        </div>

        <nav className="clv-overview__compositions" aria-label="Composições de validação">
          {compositions.map((composition) => (
            <a
              className="clv-overview__composition"
              href={composition.href}
              key={composition.title}
              target="_top"
            >
              <span className="clv-overview__product">{composition.product}</span>
              <strong>{composition.title}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "Uma base consistente para o App e o Hub." }),
    ).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Atualização mais recente" })).toBeVisible();
    await expect(canvas.getByText(`${catalogStats.components} publicados`)).toBeVisible();
    await expect(canvas.getByText(`${catalogStats.variations} documentadas`)).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "11 componentes aguardam revisão" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("list", { name: "Componentes aguardando revisão" }),
    ).toBeVisible();
    await expect(canvas.getByRole("navigation", { name: "Áreas do Design System" })).toBeVisible();
    await expect(canvas.getAllByRole("link")).toHaveLength(6);
  },
};
