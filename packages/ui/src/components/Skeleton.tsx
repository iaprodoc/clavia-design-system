import type { CSSProperties, HTMLAttributes } from "react";

export type SkeletonShape = "circle" | "rectangle" | "text";
export type SkeletonMotion = "none" | "pulse" | "shimmer";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  height?: CSSProperties["height"];
  label?: string;
  motion?: SkeletonMotion;
  shape?: SkeletonShape;
  width?: CSSProperties["width"];
}

/**
 * Reserva o espaço de conteúdo que ainda está carregando e reduz mudanças bruscas de layout.
 */
export function Skeleton({
  className,
  height,
  label,
  motion = "shimmer",
  shape = "rectangle",
  style,
  width,
  ...props
}: SkeletonProps) {
  const classes = [
    "clv-skeleton",
    `clv-skeleton--${shape}`,
    `clv-skeleton--motion-${motion}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const skeletonStyle = { ...style, height, width };

  if (!label) {
    return <div aria-hidden="true" className={classes} style={skeletonStyle} {...props} />;
  }

  return (
    <div aria-label={label} className={classes} role="status" style={skeletonStyle} {...props}>
      <span className="clv-sr-only">{label}</span>
    </div>
  );
}
