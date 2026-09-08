import { ChevronDownIcon } from "@clavia-ds/icons";
import { forwardRef, type SelectHTMLAttributes } from "react";

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * Alternativa nativa para fluxos em que o seletor do sistema operacional seja preferível.
 * Este componente não torna o pacote compatível com React 18; novos fluxos do App usam Select.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { className, ...props },
  ref,
) {
  const classes = ["clv-native-select", className].filter(Boolean).join(" ");

  return (
    <span className="clv-native-select__root">
      <select className={classes} ref={ref} {...props} />
      <ChevronDownIcon aria-hidden="true" className="clv-native-select__indicator" />
    </span>
  );
});
