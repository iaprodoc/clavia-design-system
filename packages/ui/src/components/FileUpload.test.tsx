import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FileUpload } from "./FileUpload";

const baseProps = {
  description: "Envie um PDF com informações de apoio.",
  onFileSelect: vi.fn(),
  title: "Documento de apoio",
};

describe("FileUpload", () => {
  it("encaminha o arquivo selecionado ao consumidor", () => {
    const onFileSelect = vi.fn();
    const { container } = render(
      <FileUpload {...baseProps} accept="application/pdf" onFileSelect={onFileSelect} />,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(["conteúdo"], "portfolio.pdf", { type: "application/pdf" });

    expect(input).not.toBeNull();
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it("bloqueia arquivos maiores que o limite antes do upload", () => {
    const onFileSelect = vi.fn();
    const { container } = render(
      <FileUpload {...baseProps} maxSizeBytes={4} onFileSelect={onFileSelect} />,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(["arquivo grande"], "portfolio.pdf", { type: "application/pdf" });

    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });
    expect(screen.getByRole("alert")).toHaveTextContent("O arquivo deve ter no máximo 1 KB.");
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it("bloqueia tipos fora da especificação accept antes do upload", () => {
    const onFileSelect = vi.fn();
    const { container } = render(
      <FileUpload {...baseProps} accept="application/pdf,.docx" onFileSelect={onFileSelect} />,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(["imagem"], "comprovante.png", { type: "image/png" });

    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });

    expect(screen.getByRole("alert")).toHaveTextContent("Este tipo de arquivo não é aceito.");
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it("comunica progresso, erro e ações de recuperação", () => {
    const onRemove = vi.fn();
    const onRetry = vi.fn();
    const { rerender } = render(
      <FileUpload
        {...baseProps}
        onRemove={onRemove}
        value={{ name: "portfolio.pdf", progress: 48, status: "uploading" }}
      />,
    );

    expect(screen.getByRole("progressbar", { name: "Envio de portfolio.pdf" })).toHaveAttribute(
      "aria-valuenow",
      "48",
    );

    rerender(
      <FileUpload
        {...baseProps}
        onRemove={onRemove}
        onRetry={onRetry}
        value={{ error: "A conexão foi interrompida.", name: "portfolio.pdf", status: "error" }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("A conexão foi interrompida.");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    fireEvent.click(screen.getByRole("button", { name: "Remover" }));
    expect(onRetry).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
