import { Dialog, type DialogProps } from "./Dialog";

/**
 * Confirma uma ação crítica. Diferentemente de `Dialog`, não fecha por Escape
 * nem pelo clique fora do conteúdo: a pessoa precisa escolher uma ação explícita.
 */
export type AlertDialogProps = Omit<DialogProps, "variant">;

export function AlertDialog({ showCloseButton = true, ...props }: AlertDialogProps) {
  return <Dialog {...props} showCloseButton={showCloseButton} variant="alert" />;
}
