# Contrato de versão

Três pacotes, **uma versão**. `@clavia-ds/tokens`, `@clavia-ds/icons` e
`@clavia-ds/ui` saem sempre juntos (grupo `fixed` do changesets). Para um conjunto
de três isso é estritamente melhor: "estamos no DS 1.4.2" é um número só em
qualquer conversa, e não existe a possibilidade de `ui@1.4.0` parear com um
`tokens@1.3.0` incompatível.

## Por que o contrato é mais rígido que o normal

Um `--clv-*` e uma classe `.clv-*` são **API pública sem checagem em tempo de
compilação**. Prop errada de componente o TypeScript pega no consumidor; token
removido, não — a declaração cai em silêncio e a página vai quebrada para
produção. As regras abaixo compensam essa assimetria.

## Tokens

| Mudança | Bump |
|---|---|
| Adicionar token | minor |
| Renomear ou remover token | **major** — e só depois de um minor de depreciação mantendo o nome antigo como alias por um ciclo major inteiro |
| Mudar o hex de um primitivo L1 (`--clv-color-primitive-blue-9`) | minor — visível em todo lugar, mas nada quebra estruturalmente; é o canal de propagação pretendido |
| Reapontar um token L2/L3 para outro primitivo | minor |
| Correção de valor que restaura a intenção (contraste, 1px, typo) | patch |
| Mudar o *tipo* de um token (comprimento vira cor, escalar vira composto) | **major** |

## Classes CSS

O `clavia-site` consome as classes sem importar nenhum JS, então não recebe
nenhum erro de tipo. Daí a dureza da linha de box model.

| Mudança | Bump |
|---|---|
| Adicionar classe ou modificador `.clv-*` | minor |
| Mudar cor, sombra ou background dentro de uma classe existente | minor |
| Mudar box model — padding, height, display, grid/flex | **major** — muda a composição do consumidor |
| Renomear ou remover classe | **major** |

## Props de componente

| Mudança | Bump |
|---|---|
| Prop opcional nova | minor |
| Adicionar `"use client"` | minor — faz funcionar um uso que estava quebrado |
| Remover `"use client"` | **major** |
| Prop obrigatória nova, removida, renomeada, ou tipo estreitado | **major** |
| Export removido do barrel | **major** |
| Default alterado de forma que muda o render | **major** |
| Alargar o range de `peerDependencies` | minor |
| Estreitar o range de `peerDependencies` | **major** |

## A regra de bolso

**Se um screenshot muda, é no mínimo minor. Patch significa nenhum diff visual —
ou um diff que você descreveria como correção de bug.**

## O fluxo

1. Todo PR que muda comportamento leva um changeset: `pnpm changeset`.
   O bump vira **um arquivo markdown revisável dentro do PR** — dá para discordar
   dele em code review. Esse rastro é o produto aqui, mais que a automação.
2. Merge na `main` → o `changesets/action` abre (ou atualiza) o PR
   **"Version Packages"** com os bumps e o changelog gerado.
3. Merge desse PR → publica no npm, cria a tag `v1.4.2` e o GitHub Release.
   Nada é publicado sem alguém mesclar um PR que diz, em português, o que mudou
   e por que o bump é o que é.
4. Nos consumidores, o Renovate abre um PR **agrupado** com os três pacotes.
   O agrupamento é obrigatório: lockstep exige que se movam juntos.

`pnpm check` (lint → build → pack:check → pack:smoke em React 18 e 19 → install
offline → typecheck → testes) roda no PR **e** antes de publicar.
