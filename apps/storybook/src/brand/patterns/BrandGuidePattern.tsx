const guideNodes = [
  "top-start",
  "top-center",
  "top-end",
  "middle-start",
  "middle-center",
  "middle-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
] as const;

export interface BrandGuidePatternProps {
  className?: string;
}

export function BrandGuidePattern({ className }: BrandGuidePatternProps) {
  const classes = ["clv-brand-guides-frame__decoration", className].filter(Boolean).join(" ");

  return (
    <div aria-hidden="true" className={classes}>
      <span className="clv-brand-guides-line clv-brand-guides-line--top" />
      <span className="clv-brand-guides-line clv-brand-guides-line--middle" />
      <span className="clv-brand-guides-line clv-brand-guides-line--bottom" />
      <span className="clv-brand-guides-line clv-brand-guides-line--rail-start" />
      <span className="clv-brand-guides-line clv-brand-guides-line--vertical" />
      <span className="clv-brand-guides-line clv-brand-guides-line--rail-end" />
      {guideNodes.map((position) => (
        <span className={`clv-brand-guides-node clv-brand-guides-node--${position}`} key={position}>
          <span className="clv-brand-guides-node__dot" />
        </span>
      ))}
    </div>
  );
}
