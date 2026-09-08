import { CircleAlertIcon, CircleCheckIcon, FileTextIcon } from "@clavia-ds/icons";
import { type ChangeEvent, type DragEvent, useId, useRef, useState } from "react";

import { Button } from "./Button";
import { Progress } from "./Progress";

export type FileUploadStatus = "error" | "selected" | "success" | "uploading";

export interface FileUploadValue {
  error?: string;
  name: string;
  progress?: number;
  size?: number;
  status: FileUploadStatus;
}

export interface FileUploadProps {
  accept?: string;
  className?: string;
  description: string;
  disabled?: boolean;
  helpText?: string;
  id?: string;
  maxSizeBytes?: number;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  onRetry?: () => void;
  recommended?: boolean;
  title: string;
  value?: FileUploadValue;
}

function formatBytes(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

function acceptsFile(file: File, accept?: string) {
  if (!accept) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return accept.split(",").some((entry) => {
    const accepted = entry.trim().toLowerCase();
    if (!accepted) return false;
    if (accepted.startsWith(".")) return fileName.endsWith(accepted);
    if (accepted.endsWith("/*")) return fileType.startsWith(accepted.slice(0, -1));
    return fileType === accepted;
  });
}

/**
 * Seleciona um arquivo e comunica progresso, sucesso ou falha sem executar o upload.
 */
export function FileUpload({
  accept,
  className,
  description,
  disabled = false,
  helpText,
  id: providedId,
  maxSizeBytes,
  onFileSelect,
  onRemove,
  onRetry,
  recommended = false,
  title,
  value,
}: FileUploadProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const helpId = helpText ? `${id}-help` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const classes = ["clv-file-upload", className].filter(Boolean).join(" ");

  function selectFile(file?: File) {
    if (!file) {
      return;
    }

    if (!acceptsFile(file, accept)) {
      setLocalError("Este tipo de arquivo não é aceito.");
      return;
    }

    if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
      setLocalError(`O arquivo deve ter no máximo ${formatBytes(maxSizeBytes)}.`);
      return;
    }

    setLocalError(undefined);
    onFileSelect(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragActive(false);
    if (!disabled) {
      selectFile(event.dataTransfer.files[0]);
    }
  }

  const statusLabel = value
    ? {
        error: "Falha no envio",
        selected: "Pronto para enviar",
        success: "Arquivo enviado",
        uploading: "Enviando arquivo",
      }[value.status]
    : undefined;
  const statusIcon =
    value?.status === "error" ? (
      <CircleAlertIcon />
    ) : value?.status === "success" ? (
      <CircleCheckIcon />
    ) : (
      <FileTextIcon />
    );

  return (
    <div className={classes}>
      <div className="clv-file-upload__header">
        <span aria-hidden="true" className="clv-file-upload__header-icon">
          <FileTextIcon />
        </span>
        <div>
          <div className="clv-file-upload__title-row">
            <h2 id={`${id}-title`}>{title}</h2>
            {recommended ? <span className="clv-file-upload__recommended">Recomendado</span> : null}
          </div>
          <p id={descriptionId}>{description}</p>
        </div>
      </div>

      <input
        accept={accept}
        aria-label={`Selecionar arquivo para ${title}`}
        className="clv-sr-only"
        disabled={disabled}
        id={id}
        onChange={handleInputChange}
        ref={inputRef}
        type="file"
      />

      {value ? (
        <div className={`clv-file-upload__file clv-file-upload__file--${value.status}`}>
          <span aria-hidden="true" className="clv-file-upload__file-icon">
            {statusIcon}
          </span>
          <div className="clv-file-upload__file-content">
            <strong>{value.name}</strong>
            <span>
              {[statusLabel, value.size ? formatBytes(value.size) : undefined]
                .filter(Boolean)
                .join(" · ")}
            </span>
            {value.status === "uploading" ? (
              <Progress label={`Envio de ${value.name}`} value={value.progress ?? 0} />
            ) : null}
            {value.status === "error" && value.error ? <p role="alert">{value.error}</p> : null}
          </div>
          <div className="clv-file-upload__actions">
            {value.status === "error" && onRetry ? (
              <Button onClick={onRetry} size="sm" variant="secondary">
                Tentar novamente
              </Button>
            ) : null}
            {onRemove ? (
              <Button disabled={disabled} onClick={onRemove} size="sm" variant="text">
                Remover
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <button
          aria-describedby={[descriptionId, helpId].filter(Boolean).join(" ")}
          className={`clv-file-upload__dropzone${dragActive ? " clv-file-upload__dropzone--active" : ""}`}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          type="button"
        >
          <span aria-hidden="true" className="clv-file-upload__upload-mark">
            ↑
          </span>
          <span>Arraste o arquivo aqui ou selecione no dispositivo</span>
          {helpText ? <small id={helpId}>{helpText}</small> : null}
        </button>
      )}

      {localError ? (
        <p className="clv-file-upload__error" role="alert">
          {localError}
        </p>
      ) : null}
    </div>
  );
}
