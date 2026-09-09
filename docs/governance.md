# Governança: o que é do design system e o que é do app

Este documento é a fonte única. Os `CLAUDE.md` dos apps consumidores **linkam para
cá e não reescrevem** — quatro cópias divergem em um trimestre.

## A lei do namespace

1. `--clv-*` pertence ao design system. **Só o design system define um em `:root`.**
2. Apps **referenciam** `--clv-*` à vontade.
3. Apps **remapeiam** `--clv-*` dentro de um **seletor escopado** —
   `[data-tone='on-dark']`, `[data-clv-density='compact']`. Nunca em `:root`.
4. Apps definem tokens próprios sob `--app-*` (produtos) / `--site-*` (marketing).
   **Nunca cunhe um nome `--clv-` local.**

A regra 4 é a que as pessoas quebram, e ela existe por um motivo mecânico: um nome
`--clv-` local faz um valor do app passar por token do design system. No dia em que
o design system publicar o mesmo nome, quem carregar por último vence — sem erro,
sem aviso, só a página errada.

## Por que as regras de token são mais duras do que parecem

Um `--clv-*` e uma classe `.clv-*` são **API pública sem checagem em tempo de
compilação**. O app escreve `var(--clv-space-4)` num stylesheet; se o token some,
nada dá erro — a declaração cai em silêncio e a página vai quebrada para produção.
É por isso que remover um token é major e que todo repo consumidor roda um
validador de tokens no CI.

## Árvore de decisão — tokens

```
Preciso de um valor?
├─ Já existe token do DS com esse significado?  (buscar no tokens.json, não no CSS)
│   └─ SIM → usar. Fim.
├─ Mesmo papel semântico, valor diferente num contexto?
│  (seção escura, grid compacto)
│   └─ SIM → remap escopado no app. NUNCA em :root.
├─ O valor codifica marca, ou faz sentido para mais de um app?
│   └─ SIM → design system. PR + changeset. Bloqueia num release.
├─ É mecânica do app? (altura da nav, colunas de um grid, acento de uma feature)
│   └─ SIM → local, como --app-* / --site-*.
└─ Na dúvida → local primeiro.
   Promover depois é barato; despublicar um token do DS é major.
```

## Árvore de decisão — componentes

```
Preciso de um componente?
├─ @clavia-ds/ui já exporta?              → usar. Nunca reimplementar.
├─ Existe mas falta prop/variante?        → PR no DS (prop opcional = minor).
│                                            Nunca forkar.
├─ É composição de primitivos do DS com copy/dado do app?
│                                          → local. Composição nunca é DS.
├─ É um PRIMITIVO novo, sem semântica de produto?          → DS.
│  (rating, segmented control, split button)
└─ É UI de domínio? (Fila, CardDaReuniao, AgendarDrawer)   → app, para sempre.
```

A linha que separa: **o design system não sabe o que é um lead.** Se o componente
precisa saber, ele é do app.

## Os gatilhos que forçam promoção

Sem estes, a árvore vira boa intenção. Qualquer um destes obriga a promoção dentro
de um ciclo de release:

1. O mesmo nome de token local, ou o mesmo valor no mesmo papel, aparece em **2+ repos**.
2. O mesmo primitivo local é copiado para um segundo app.
3. Um componente local ganha comportamento de teclado ou ARIA. Acessibilidade é
   exatamente o que uma biblioteca compartilhada sobre react-aria existe para
   resolver — e exatamente o que se faz errado duas vezes.
4. Um hex ou `rgb()` cru aparece no código do app. É um token que ainda não foi nomeado.

## Como isso é cobrado, e não só combinado

| Repo | Cobrador | O que ele impede |
|---|---|---|
| `clavia-design-system` | `packages/ui/src/architecture.test.ts` | Tailwind/HeroUI voltarem; import direto de phosphor/lucide; componente com hook sem `"use client"` |
| | `scripts/pack-check.mjs` | Tarball com dep `workspace:`, CSS divergente, `var(--clv-*)` que não resolve |
| | `scripts/consumer-smoke.mjs` | Quebrar React 18 ou 19; quebrar SSR |
| `clavia-site` | `tools/check-tokens.mjs` | Referência a token inexistente; redefinição de token do DS em `:root` |
| `clavia-salesops` | `tools/check-tokens.py` | O mesmo, em Python, encadeado no `npm run typecheck` |

## Caso de estudo: os tokens de marketing do clavia-site

O melhor exemplo trabalhado que existe, porque é real e ainda está aberto.

O `clavia-site` precisou de coisas que o design system não tinha: tipo display
(a escala do DS para em `2rem`), ritmo de seção, escala de z-index, larguras de
layout e superfícies on-dark. Ele criou tudo em `marketing-tokens.css` — **com
nomes `--clv-`**, violando a regra 4.

Aplicando a árvore, o conjunto se separa em dois:

| Token | Destino | Por quê |
|---|---|---|
| `--clv-font-size-display-1/2/3`, `-lead` | **promover** | Tipo display não é capricho de marketing, é lacuna do DS |
| `--clv-space-section-md/lg/xl` | **promover** | Ritmo de seção é L2, ao lado de `--clv-spacing-section-*` |
| `--clv-z-base…toast` | **promover** | Um DS com dialog, popover, tooltip e toast e *nenhuma* escala de z-index está incompleto — o SalesOps vai precisar |
| `--clv-layout-max-width`, `-prose-width`, `-gutter` | **promover** | O DS já tem `--clv-layout-container-*` |
| `--clv-color-*-on-dark*` | **promover** | O DS é light-only e os dois apps precisam de superfície escura |
| `--clv-layout-header-height{,-scrolled}` | **renomear `--site-*`** | Cromo do app |
| `--clv-motion-reveal`, `-slow`, `-easing-out` | **renomear `--site-*`** | Movimento de scroll de marketing é do site |

Um minor no DS (~20 tokens) e um rename de 5 no site. Note o formato da resposta:
não é "tudo sobe" nem "tudo fica" — é uma triagem, e o critério é *se outro app
precisaria disso*, não *quem escreveu primeiro*.
