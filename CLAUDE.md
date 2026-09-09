# clavia-design-system — guia para agentes

Design system da Clavia. Publica três pacotes no npm público e o Storybook.
Leia o [README.md](README.md) primeiro para consumo e scripts.

Hub do workspace: [`../CLAUDE.md`](../CLAUDE.md) · regras de criação de repos e
arquivos: [`../CONVENTIONS.md`](../CONVENTIONS.md).

## O que é o quê

| Pacote | Contém | Consumido como |
|---|---|---|
| `@clavia-ds/tokens` | 3 artefatos sincronizados: `tokens.css` (custom properties), `tokens.json` (W3C DTCG) e `index.ts` (objeto tipado) | `import "@clavia-ds/tokens/css"` |
| `@clavia-ds/icons` | Re-export nomeado de `@phosphor-icons/react` + ícones próprios | `import { CheckIcon } from "@clavia-ds/icons"` |
| `@clavia-ds/ui` | Componentes React sobre `react-aria-components`, CSS BEM à mão | `import { Button } from "@clavia-ds/ui"` + `"@clavia-ds/ui/styles.css"` |
| `apps/storybook` | Documentação executável. Privado, não publicado | — |

Requisitos: **Node ≥22, pnpm ≥9.12** (via corepack).

## Regras que não se quebram

1. **Sem Tailwind, sem CSS-in-JS, sem Radix, sem shadcn.** CSS puro, BEM, prefixo
   `.clv-`, em `packages/ui/src/styles.css`. `architecture.test.ts` falha se
   `@tailwind`/`@theme`/`@apply` aparecerem ou se `tailwindcss` virar dependência.
2. **Nenhum valor literal fora de `tokens.css`.** Componente consome token, nunca hex.
3. **Os três artefatos de token andam juntos.** Mudou `tokens.css`, mudou
   `tokens.json` e `index.ts`. Os testes de paridade existem para isso.
4. **Componente com hook leva `"use client"` na primeira linha.** Os dois
   consumidores são Next App Router com Server Components por padrão; sem a
   diretiva, quebram no build. A regra vale para `useState`, `useId`, `useRef`,
   `useContext` — `useId` também. E o barrel `src/index.ts` **nunca** leva a
   diretiva: ali ela transformaria os 80 exports em client components.
5. **A camada semântica é a API.** Componentes consomem L2/L3
   (`--clv-color-action-primary`), nunca L1 (`--clv-color-primitive-blue-10`).
   Primitivo é para definir tema, não para usar.
6. **Todo PR que muda comportamento leva changeset.** `pnpm changeset`.
   Contrato de bump em [`docs/versioning.md`](docs/versioning.md).

## O que vai daqui e o que fica no app

[`docs/governance.md`](docs/governance.md). Resumo: `--clv-*` é nosso, o app usa e
pode remapear em seletor escopado, mas nunca define em `:root` nem cunha nome
`--clv-` novo — local vai com `--app-*` / `--site-*`.

## Antes de dar por pronto

```bash
pnpm check   # lint → build → pack:check → pack:smoke → install offline → typecheck → test
```

`pack:check` empacota os três tarballs e verifica que nenhuma dep `workspace:`
sobreviveu, que o CSS é byte-idêntico ao fonte e que **todo `var(--clv-*)`
empacotado resolve**. `pack:smoke` instala os tarballs e faz SSR em React 18.3.1
**e** 19.2.8. São os dois portões que impedem publicar algo quebrado.

## Armadilhas já pagas

- **A suíte de browser do Storybook dimensionava workers pelo número de núcleos.**
  Numa máquina grande a página cai no meio da suíte e a story sorteada muda a cada
  execução. Teto em `apps/storybook/vitest.config.ts` — não remova.
- **`consumer-smoke.mjs` já fixou a versão na chave de override do pnpm.**
  Overrides casam por `nome@versão`; fixar a versão faz o smoke test quebrar no
  primeiro `changeset version`, isto é, no release em que ele mais importa.
  A versão é lida do manifesto.
- **A entrega inicial veio como um commit squashed, force-pushed, de autor
  sintético.** A tag `entrega-fornecedor-2026-09-08` marca essa fronteira. A `main`
  hoje proíbe force-push.

## Storybook

```bash
pnpm storybook   # dev na 6006
```
