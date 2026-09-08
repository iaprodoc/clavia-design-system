import type { ReactNode } from "react";
import { Alert, type AlertStatus } from "./Alert";

export interface InlineBannerProps {
  action?: ReactNode;
  children: ReactNode;
  status?: AlertStatus;
  title?: string;
}
export function InlineBanner({ action, children, status = "info", title }: InlineBannerProps) {
  return (
    <Alert
      actions={action}
      className="clv-inline-banner"
      size="sm"
      status={status}
      {...(title === undefined ? {} : { title })}
    >
      {children}
    </Alert>
  );
}
