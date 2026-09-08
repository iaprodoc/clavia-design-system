import type { ReactNode } from "react";

export type KeyValueOrientation = "horizontal" | "vertical";

export interface KeyValueItem {
  id?: string;
  label: string;
  value: ReactNode;
}

export interface KeyValueProps {
  className?: string;
  items: readonly KeyValueItem[];
  orientation?: KeyValueOrientation;
}

export function KeyValue({ className, items, orientation = "vertical" }: KeyValueProps) {
  return (
    <dl
      className={["clv-key-value", `clv-key-value--${orientation}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, index) => (
        <div className="clv-key-value__item" key={item.id ?? `${item.label}-${index}`}>
          <dt className="clv-key-value__label">{item.label}</dt>
          <dd className="clv-key-value__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
