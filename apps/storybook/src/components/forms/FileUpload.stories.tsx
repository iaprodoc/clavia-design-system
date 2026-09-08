import { FileUpload, type FileUploadValue } from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

const baseArgs = {
  accept: "application/pdf",
  description: "Envie um PDF com informações que ajudem na preparação do atendimento.",
  helpText: "PDF, máximo de 10 MB",
  maxSizeBytes: 10 * 1024 * 1024,
  onFileSelect: fn(),
  recommended: true,
  title: "Documento de apoio",
};

const meta = {
  args: baseArgs,
  component: FileUpload,
  decorators: [
    (Story) => (
      <div className="clv-story-file-upload-preview">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Seleciona um arquivo e apresenta os estados controlados de seleção, envio, sucesso e falha. O componente valida localmente o tipo indicado em accept e o limite de tamanho, mas nunca executa o upload: conteúdo, autorização, armazenamento, antivírus e remoção segura continuam sob responsabilidade do produto e do servidor.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Componentes/Formulários/FileUpload",
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveUpload() {
  const [value, setValue] = useState<FileUploadValue>();
  return (
    <FileUpload
      {...baseArgs}
      onFileSelect={(file) => setValue({ name: file.name, size: file.size, status: "selected" })}
      onRemove={() => setValue(undefined)}
      {...(value ? { value } : {})}
    />
  );
}

export const Selecao: Story = {
  name: "Seleção",
  render: () => <InteractiveUpload />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');

    if (!input) {
      throw new Error("Campo de arquivo não encontrado.");
    }

    const file = new File(["conteúdo fictício"], "portfolio-clinica.pdf", {
      type: "application/pdf",
    });
    await userEvent.upload(input, file);
    await expect(canvas.getByText("portfolio-clinica.pdf")).toBeVisible();
    await expect(canvas.getByText(/Pronto para enviar/)).toBeVisible();
  },
};

export const EstadosDeEnvio: Story = {
  name: "Estados de envio",
  render: () => (
    <div className="clv-story-stack">
      <FileUpload
        {...baseArgs}
        value={{ name: "portfolio-clinica.pdf", progress: 48, size: 840000, status: "uploading" }}
      />
      <FileUpload
        {...baseArgs}
        onRemove={fn()}
        value={{ name: "portfolio-clinica.pdf", size: 840000, status: "success" }}
      />
      <FileUpload
        {...baseArgs}
        onRemove={fn()}
        onRetry={fn()}
        value={{
          error: "A conexão foi interrompida. Tente enviar novamente.",
          name: "portfolio-clinica.pdf",
          size: 840000,
          status: "error",
        }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("progressbar", { name: /Envio de portfolio-clinica/ }),
    ).toBeVisible();
    await expect(canvas.getByRole("alert")).toHaveTextContent("A conexão foi interrompida");

    const errorCard = canvasElement.querySelector<HTMLElement>(".clv-file-upload__file--error");
    const errorContent = errorCard?.querySelector<HTMLElement>(".clv-file-upload__file-content");
    const errorActions = errorCard?.querySelector<HTMLElement>(".clv-file-upload__actions");

    if (!errorCard || !errorContent || !errorActions) {
      throw new Error("Estrutura do estado de falha não encontrada.");
    }

    const errorCanvas = within(errorCard);
    await expect(errorCanvas.getByRole("button", { name: "Tentar novamente" })).toBeVisible();
    await expect(errorCanvas.getByRole("button", { name: "Remover" })).toBeVisible();
    await expect(errorActions.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      errorContent.getBoundingClientRect().bottom,
    );
  },
};

export const TipoNaoAceito: Story = {
  name: "Tipo não aceito",
  render: () => <InteractiveUpload />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');

    if (!input) {
      throw new Error("Campo de arquivo não encontrado.");
    }

    await userEvent.upload(
      input,
      new File(["imagem fictícia"], "foto.png", { type: "image/png" }),
      { applyAccept: false },
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Este tipo de arquivo não é aceito.");
  },
};
