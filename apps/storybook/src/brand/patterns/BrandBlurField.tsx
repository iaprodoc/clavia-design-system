export interface BrandBlurFieldProps {
  className?: string;
}

const blurLayers = [
  {
    className: "clv-brand-blur-field__layer--blue",
    src: "/clavia-blur-ellipse-lower.svg",
  },
  {
    className: "clv-brand-blur-field__layer--navy",
    src: "/clavia-blur-ellipse-upper.svg",
  },
] as const;

export function BrandBlurField({ className }: BrandBlurFieldProps) {
  const classes = ["clv-brand-blur-field", className].filter(Boolean).join(" ");

  return (
    <div aria-hidden="true" className={classes}>
      {blurLayers.map((layer) => (
        <img
          alt=""
          className={`clv-brand-blur-field__layer ${layer.className}`}
          draggable="false"
          key={layer.src}
          src={layer.src}
        />
      ))}
    </div>
  );
}
