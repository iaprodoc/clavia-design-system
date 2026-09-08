import type { HTMLAttributes } from "react";

import { ClaviaLogo, type ClaviaLogoProps, type ClaviaLogoTone } from "./ClaviaLogo";

export interface ClaviaProductLockupProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "role"> {
  /** Nome curto da solução que acompanha o wordmark, como Hub ou App. */
  solution: string;
  /** Uma das quatro cores oficiais da marca. */
  tone?: ClaviaLogoTone;
  /** Largura do wordmark; a proporção do vetor é preservada. */
  wordmarkWidth?: ClaviaLogoProps["width"];
}

export function ClaviaProductLockup({
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  solution,
  tone = "primary",
  wordmarkWidth = 88,
  ...props
}: ClaviaProductLockupProps) {
  const isHidden = ariaHidden === true || ariaHidden === "true";
  const accessibleName = ariaLabel ?? (ariaLabelledBy ? undefined : `Clavia ${solution}`);
  const classes = ["clv-product-lockup", `clv-product-lockup--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      aria-hidden={ariaHidden}
      aria-label={isHidden ? undefined : accessibleName}
      aria-labelledby={isHidden ? undefined : ariaLabelledBy}
      className={classes}
      data-tone={tone}
      role="img"
    >
      <ClaviaLogo aria-hidden tone={tone} width={wordmarkWidth} />
      <span aria-hidden="true" className="clv-product-lockup__solution">
        {solution}
      </span>
    </span>
  );
}
