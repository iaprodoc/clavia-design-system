import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  isDisabled?: boolean;
  variant?: "primary" | "secondary";
}

export function LinkButton({
  children,
  className,
  isDisabled = false,
  onClick,
  tabIndex,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  const classes = ["clv-link-button", `clv-link-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");
  const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };
  const anchorProps = isDisabled ? { ...props, onClick: preventNavigation } : { ...props, onClick };

  return (
    <a
      {...anchorProps}
      aria-disabled={isDisabled || undefined}
      className={classes}
      tabIndex={isDisabled ? -1 : tabIndex}
    >
      {children}
    </a>
  );
}
