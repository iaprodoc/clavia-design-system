# Clavia Design System

Este repositório reúne os tokens, ícones, componentes React e o catálogo Storybook da Clavia. O código compartilhado não inclui regras de negócio, rotas, persistência nem integrações dos produtos consumidores.

## Estrutura

- `packages/tokens` — tokens semânticos em TypeScript, CSS e JSON.
- `packages/icons` — ícones funcionais com contrato acessível.
- `packages/ui` — componentes React e estilos próprios do Design System.
- `apps/storybook` — documentação executável, estados e exemplos com dados fictícios.

## Requisitos

- Node.js 22 ou mais recente.
- pnpm 9.12 ou mais recente.

## Instalação e desenvolvimento

```bash
pnpm install --frozen-lockfile
pnpm storybook
```

O Storybook fica disponível em `http://localhost:6006`.

## Build e verificação

```bash
pnpm build
pnpm check
```

O gate completo executa lint, builds, validação dos pacotes, smoke test de consumo em React 18 e 19, typecheck e testes automatizados.

## Consumo dos pacotes

Os três pacotes são publicados no **npm público**, em lockstep — sempre na mesma
versão. Publicar no registro público é escolha de distribuição, não de licença:
ver [LICENSE](LICENSE).

```bash
npm i @clavia-ds/tokens          # só os tokens (site institucional)
npm i @clavia-ds/{tokens,icons,ui}   # tokens + componentes (apps de produto)
```

Há três níveis de consumo, e cada app escolhe um:

| Nível | O que se importa | Acoplamento |
|---|---|---|
| **1 — tokens CSS** | `@clavia-ds/tokens/css` | Nenhum. Sem JS, sem React, sem framework |
| **2 — tokens como dado** | `@clavia-ds/tokens` (objeto tipado) e `/json` | Só build time. Alimenta geradores e paletas de gráfico |
| **3 — componentes** | `@clavia-ds/ui` + `@clavia-ds/icons` | Total. React 18/19 e o `styles.css` inteiro |

O `styles.css` não tem subpath por componente: é tudo ou nada. Para uma landing
page isso pesa; para um app atrás de login, não. O `clavia-site` fica no nível 1
de propósito, o `clavia-salesops` vai para o 3.

Importe os tokens e os estilos uma vez no ponto de entrada do produto:

```tsx
import "@clavia-ds/tokens/css";
import "@clavia-ds/ui/styles.css";
```

Depois, importe os componentes e ícones necessários:

```tsx
import { CheckIcon } from "@clavia-ds/icons";
import { Button } from "@clavia-ds/ui";

export function Example() {
  return <Button leadingIcon={<CheckIcon />}>Continuar</Button>;
}
```

Os pacotes compartilhados aceitam React 18 e 19 — o `consumer-smoke.mjs` faz SSR
nas duas versões a cada release. O Storybook deste repositório usa React 19.

Componentes com estado carregam `"use client"`, então funcionam em Next App
Router. O barrel não carrega a diretiva, de propósito: se carregasse, os 80
exports virariam client components para todo consumidor.

## O que vai daqui e o que fica no app

`--clv-*` pertence ao design system. O app referencia à vontade e pode remapear
em seletor escopado (`[data-tone='on-dark']`), mas nunca define em `:root` nem
cunha um nome `--clv-` novo — token local vai com `--app-*` / `--site-*`.

A árvore de decisão completa, para tokens e para componentes, está em
[`docs/governance.md`](docs/governance.md). O contrato de versão — o que é patch,
minor e major — está em [`docs/versioning.md`](docs/versioning.md).

## Deploy do Storybook

O arquivo `vercel.json` contém o comando de build e o diretório de saída esperados para um deploy na Vercel.
