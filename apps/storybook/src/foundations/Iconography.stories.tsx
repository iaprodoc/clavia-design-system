import {
  ArrowRightIcon,
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  type IconCategory,
  InfoIcon,
  iconCatalog,
  PencilIcon,
  TriangleAlertIcon,
  WhatsAppIcon,
  XIcon,
} from "@clavia-ds/icons";
import { Button, ClaviaIcon, IconButton, StatusBadge } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import "./iconography.css";

const categoryOrder: readonly IconCategory[] = [
  "Ação",
  "Ajuda",
  "Navegação",
  "Status",
  "Objeto",
  "Canal",
  "Domínio",
];

const categoryIds: Record<IconCategory, string> = {
  Ação: "catalogo-acao",
  Ajuda: "catalogo-ajuda",
  Canal: "catalogo-canal",
  Domínio: "catalogo-dominio",
  Navegação: "catalogo-navegacao",
  Objeto: "catalogo-objeto",
  Status: "catalogo-status",
};

const iconGroups = categoryOrder.map((category) => ({
  category,
  icons: iconCatalog.filter((icon) => icon.category === category),
  id: categoryIds[category],
}));

function IconographyPage() {
  return (
    <main className="clv-iconography-page">
      <header className="clv-iconography-intro">
        <span>Fundamento transversal</span>
        <h1>Iconografia</h1>
        <p>
          <code>@clavia-ds/icons</code> é o ponto único de consumo dos ícones funcionais da Clavia.
          O catálogo é curado por necessidades reais dos produtos digitais da Clavia; ele não
          replica todo o catálogo do Phosphor.
        </p>
      </header>

      <section aria-labelledby="catalog-title" className="clv-iconography-section">
        <div className="clv-iconography-section__heading">
          <div>
            <span>{iconCatalog.length} exports públicos</span>
            <h2 id="catalog-title">Catálogo oficial</h2>
          </div>
          <p>
            Explore por intenção. O nome técnico identifica o export; por isso, os SVGs desta grade
            são decorativos.
          </p>
        </div>
        <nav aria-label="Categorias do catálogo" className="clv-iconography-category-nav">
          {iconGroups.map(({ category, icons, id }) => (
            <a href={`#${id}`} key={category}>
              {category}
              <span>{icons.length}</span>
            </a>
          ))}
        </nav>
        <div className="clv-iconography-catalog-groups">
          {iconGroups.map(({ category, icons, id }) => (
            <section
              aria-labelledby={`${id}-title`}
              className="clv-iconography-catalog-group"
              data-testid="icon-category"
              id={id}
              key={category}
            >
              <header>
                <h3 id={`${id}-title`}>{category}</h3>
                <span>
                  {icons.length} {icons.length === 1 ? "ícone" : "ícones"}
                </span>
              </header>
              <ul className="clv-iconography-catalog">
                {icons.map(({ component: Icon, intent, name, source }) => (
                  <li data-testid="public-icon" key={name}>
                    <span aria-hidden="true" className="clv-iconography-catalog__icon">
                      <Icon />
                    </span>
                    <div className="clv-iconography-catalog__identity">
                      <code title={name}>{name}</code>
                      <small>{source}</small>
                    </div>
                    <span className="clv-iconography-catalog__intent">{intent}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="contract-title" className="clv-iconography-section">
        <div className="clv-iconography-section__heading">
          <div>
            <span>Contrato visual</span>
            <h2 id="contract-title">Proporção estável, tamanho pelo contexto</h2>
          </div>
          <p>
            O wrapper usa <code>1em</code>, peso <code>bold</code> e <code>currentColor</code>. O
            componente consumidor define a escala e mantém o ícone alinhado ao texto. Valores
            legados de <code>strokeWidth</code> são traduzidos para pesos controlados.
          </p>
          <p>
            Peso não é ajuste decorativo: use <code>bold</code> como padrão em ícones funcionais,
            incluindo menus, controles e feedback. Em listas de dados densas, <code>regular</code>é
            permitido apenas quando o rótulo já torna a ação inequívoca e o peso bold competir com a
            leitura. A compatibilidade aceita <code>strokeWidth</code> de 1.8 a 2.39 para regular e
            2.4 ou mais para bold. Novos usos preservam o padrão; uma exceção regular precisa ser
            justificada no componente até existir uma API pública de peso.
          </p>
        </div>
        <div className="clv-iconography-contract-grid">
          <article>
            <h3>Tamanhos comprovados</h3>
            <div className="clv-iconography-sizes">
              {[12, 16, 20, 24, 32].map((size) => (
                <figure key={size}>
                  <CheckIcon aria-hidden="true" size={size} />
                  <figcaption>{size} px</figcaption>
                </figure>
              ))}
            </div>
            <p>
              12–16 px atende badges e interfaces densas; 20 px é o inline padrão; 24 px atende
              ações em viewport compacto. Reserve 32 px para destaques documentados, nunca para
              compensar um ícone semanticamente fraco.
            </p>
          </article>
          <article>
            <h3>Alinhamento e cor</h3>
            <p className="clv-iconography-inline-sample">
              <InfoIcon aria-hidden="true" />
              <span>O ícone se alinha à primeira linha e herda a cor do texto.</span>
            </p>
            <div className="clv-iconography-tone-samples">
              <span>
                <CircleCheckIcon aria-hidden="true" /> Sucesso
              </span>
              <span>
                <TriangleAlertIcon aria-hidden="true" /> Atenção
              </span>
              <span>
                <CircleAlertIcon aria-hidden="true" /> Erro
              </span>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="controls-title" className="clv-iconography-section">
        <div className="clv-iconography-section__heading">
          <div>
            <span>Controles</span>
            <h2 id="controls-title">Ícone com texto e ícone sozinho</h2>
          </div>
          <p>A ação pertence ao controle. O SVG não substitui o rótulo do botão.</p>
        </div>
        <div className="clv-iconography-control-row">
          <Button leadingIcon={<CheckIcon aria-hidden="true" />}>Confirmar dados</Button>
          <Button trailingIcon={<ArrowRightIcon aria-hidden="true" />} variant="secondary">
            Continuar
          </Button>
          <IconButton label="Editar item">
            <PencilIcon aria-hidden="true" />
          </IconButton>
          <IconButton disabled label="Remover item indisponível">
            <XIcon aria-hidden="true" />
          </IconButton>
        </div>
        <p className="clv-iconography-touch-note">
          Preserve alvos de toque de 44 × 44 px ou maiores em viewport compacto. Em interfaces
          densas, controles menores exigem contexto claro, foco visível e área operacional segura.
        </p>
      </section>

      <section aria-labelledby="a11y-title" className="clv-iconography-section">
        <div className="clv-iconography-section__heading">
          <div>
            <span>Acessibilidade</span>
            <h2 id="a11y-title">O significado não depende do desenho</h2>
          </div>
        </div>
        <div className="clv-iconography-a11y-grid">
          <article>
            <CircleCheckIcon aria-hidden="true" />
            <div>
              <h3>Decorativo com texto</h3>
              <p>
                Use <code>aria-hidden="true"</code>; o texto visível comunica o significado.
              </p>
            </div>
          </article>
          <article>
            <CircleAlertIcon aria-label="Manutenção programada" />
            <div>
              <h3>Informativo sem texto</h3>
              <p>Forneça um nome acessível ao SVG quando ele for a própria informação.</p>
            </div>
          </article>
          <article>
            <StatusBadge
              leadingIcon={<TriangleAlertIcon aria-hidden="true" />}
              status="warning"
              variant="soft"
            >
              Revisão necessária
            </StatusBadge>
            <div>
              <h3>Status crítico</h3>
              <p>Ícone, texto e cor atuam juntos; nenhum deles carrega o estado sozinho.</p>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="brand-title" className="clv-iconography-section">
        <div className="clv-iconography-section__heading">
          <div>
            <span>Marca e geometria estrutural</span>
            <h2 id="brand-title">Nem todo SVG é um ícone funcional</h2>
          </div>
        </div>
        <div className="clv-iconography-brand-grid">
          <article>
            <WhatsAppIcon aria-hidden="true" size={28} />
            <div>
              <h3>Marca de canal</h3>
              <p>
                <code>WhatsAppIcon</code> preserva o glifo vetorial já adotado pela Clavia e não é
                substituído por um balão genérico.
              </p>
            </div>
          </article>
          <article>
            <ClaviaIcon aria-hidden="true" size={40} />
            <div>
              <h3>Ativo da Clavia</h3>
              <p>Logo, redução da marca, fundos e ilustrações seguem a governança de marca.</p>
            </div>
          </article>
          <article>
            <span aria-hidden="true" className="clv-iconography-structural-line" />
            <div>
              <h3>Estrutura</h3>
              <p>Anéis de progresso, conectores e setas de popover pertencem ao componente.</p>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="decision-title" className="clv-iconography-section">
        <div className="clv-iconography-section__heading">
          <div>
            <span>Governança</span>
            <h2 id="decision-title">Como entrar no catálogo</h2>
          </div>
          <p>Uma necessidade de produto precede qualquer novo export.</p>
        </div>
        <ol className="clv-iconography-process">
          <li>
            Reutilize um export de <code>@clavia-ds/icons</code>.
          </li>
          <li>Se faltar, confirme uma demanda real e valide a semântica no Phosphor.</li>
          <li>Crie o wrapper e registre intenção e categoria no catálogo exportado.</li>
          <li>Use SVG próprio somente com origem, licença e adequação visual documentadas.</li>
          <li>Se nenhuma opção comunicar a ação, use texto até existir uma solução adequada.</li>
        </ol>
        <div className="clv-iconography-guidance-grid">
          <article className="clv-iconography-do">
            <h3>Use</h3>
            <ul>
              <li>Ícones reconhecíveis com significado estável.</li>
              <li>Outline funcional no peso bold; regular somente em listas densas com rótulo.</li>
              <li>Texto junto de estados e ações ambíguas.</li>
              <li>Hover, active, focus e disabled no controle que contém o ícone.</li>
            </ul>
          </article>
          <article className="clv-iconography-dont">
            <h3>Evite</h3>
            <ul>
              <li>Unicode ou emoji como substituto de ícone de interface.</li>
              <li>Import direto de Phosphor, Lucide ou outra biblioteca externa.</li>
              <li>Ícones preenchidos ao lado do catálogo outline sem decisão explícita.</li>
              <li>Ícone sozinho quando o significado não for universal no contexto.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  title: "Visão geral/Fundamentos/Iconografia",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GovernancaECatalogo: Story = {
  name: "Governança e catálogo",
  render: () => <IconographyPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const catalog = canvas.getAllByTestId("public-icon");
    const categories = canvas.getAllByTestId("icon-category");
    const informativeIcon = canvas.getByRole("img", { name: "Manutenção programada" });
    const phosphorIcons = canvasElement.querySelectorAll<SVGElement>(
      '[data-icon-source="phosphor"]',
    );
    const catalogPhosphorIcons = canvasElement.querySelectorAll<SVGElement>(
      '[data-testid="public-icon"] [data-icon-source="phosphor"]',
    );
    const toneSamples = canvasElement.querySelectorAll<HTMLElement>(
      ".clv-iconography-tone-samples > span",
    );

    await expect(catalog).toHaveLength(iconCatalog.length);
    await expect(categories).toHaveLength(categoryOrder.length);
    await expect(canvas.getByRole("navigation", { name: "Categorias do catálogo" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Ação" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Domínio" })).toBeVisible();
    await expect(canvas.getByText("LoaderIcon")).toBeVisible();
    await expect(canvas.getByText("PencilIcon")).toBeVisible();
    await expect(canvas.getByText("SearchIcon")).toBeVisible();
    await expect(canvas.getByText("TrashIcon")).toBeVisible();
    await expect(canvas.getByText("XIcon")).toBeVisible();
    await expect(
      canvas.getByText("O ícone se alinha à primeira linha e herda a cor do texto."),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Editar item" })).toBeVisible();
    await expect(informativeIcon).toHaveAttribute("focusable", "false");
    await expect(informativeIcon).toHaveAttribute("role", "img");
    await expect(catalogPhosphorIcons).toHaveLength(
      iconCatalog.filter(({ source }) => source === "Phosphor").length,
    );
    await expect(toneSamples).toHaveLength(3);

    if (!window.matchMedia("(forced-colors: active)").matches) {
      for (const sample of toneSamples) {
        const style = getComputedStyle(sample);

        await expect(style.paddingTop).toBe("4px");
        await expect(style.paddingRight).toBe("12px");
        await expect(style.paddingBottom).toBe("4px");
        await expect(style.paddingLeft).toBe("12px");
        await expect(sample.getBoundingClientRect().height).toBe(32);
      }
    }

    for (const item of catalog) {
      await expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }

    for (const icon of phosphorIcons) {
      await expect(icon).toHaveAttribute("data-icon-weight", "bold");
    }
  },
};
