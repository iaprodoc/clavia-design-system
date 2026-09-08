export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  decorative?: boolean;
  orientation?: DividerOrientation;
}

/** Separa blocos relacionados sem introduzir um novo contêiner visual. */
export function Divider({ decorative = false, orientation = "horizontal" }: DividerProps) {
  if (orientation === "horizontal") {
    return (
      <hr aria-hidden={decorative || undefined} className="clv-divider clv-divider--horizontal" />
    );
  }

  return <span aria-hidden="true" className="clv-divider clv-divider--vertical" />;
}
