import { XIcon } from "@clavia-ds/icons";
import type { ReactNode } from "react";

import type { IconButtonProps } from "./IconButton";
import { IconButton } from "./IconButton";

export interface CloseButtonProps extends Omit<IconButtonProps, "children" | "label"> {
  children?: ReactNode;
  label?: string;
}

/** Ação icon-only padronizada para fechar ou dispensar uma superfície. */
export function CloseButton({
  className,
  children,
  label = "Fechar",
  size = "sm",
  ...props
}: CloseButtonProps) {
  return (
    <IconButton
      className={["clv-close-button", className].filter(Boolean).join(" ")}
      label={label}
      size={size}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </IconButton>
  );
}
