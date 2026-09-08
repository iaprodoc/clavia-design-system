export type BrandGradientBarsMotion = "animated" | "still";

export interface BrandGradientBarsProps {
  className?: string;
  motion?: BrandGradientBarsMotion;
}

const bars = Array.from({ length: 6 }, (_, index) => index + 1);

export function BrandGradientBars({ className, motion = "animated" }: BrandGradientBarsProps) {
  const classes = ["clv-brand-gradient-bars", className].filter(Boolean).join(" ");

  return (
    <div aria-hidden="true" className={classes} data-motion={motion}>
      {bars.map((bar) => (
        <span className="clv-brand-gradient-bars__bar" data-bar={bar} key={bar} />
      ))}
    </div>
  );
}
