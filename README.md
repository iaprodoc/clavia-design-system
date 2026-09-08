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

Os pacotes compartilhados aceitam React 18 e 19. O Storybook deste repositório usa React 19.

## Deploy do Storybook

O arquivo `vercel.json` contém o comando de build e o diretório de saída esperados para um deploy na Vercel.
