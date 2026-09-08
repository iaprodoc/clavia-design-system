import type { MouseEventHandler } from "react";

export type SaveStatusKind = "saving" | "saved" | "error";

export interface SaveStatusProps {
  lastSavedAt?: string;
  onRetry?: MouseEventHandler<HTMLButtonElement>;
  retryLabel?: string;
  status: SaveStatusKind;
}

const labelByStatus: Record<SaveStatusKind, string> = {
  saving: "Salvando alterações",
  saved: "Alterações salvas",
  error: "Não foi possível salvar",
};

export function SaveStatus({
  lastSavedAt,
  onRetry,
  retryLabel = "Tentar novamente",
  status,
}: SaveStatusProps) {
  const label = labelByStatus[status];
  const detail = status === "saved" && lastSavedAt ? ` às ${lastSavedAt}` : "";
  const canRetry = status === "error" && onRetry;

  return (
    <div className={`clv-save-status clv-save-status--${status}`}>
      <p className="clv-save-status__message" role={status === "error" ? "alert" : "status"}>
        <span aria-hidden="true" className="clv-save-status__mark" />
        {label}
        {detail}
      </p>
      {canRetry ? (
        <button className="clv-save-status__retry" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
