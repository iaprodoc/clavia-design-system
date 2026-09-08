import { FilterDialog, FilterDialogGroup, FilterDialogRow, Select } from "@clavia-ds/ui";
import { useState } from "react";

type FilterOption = {
  label: string;
  value: string;
};

interface Phase3AdvancedFilterProps {
  fieldLabel: string;
  onApply: (value: string) => void;
  options: readonly FilterOption[];
  title: string;
  value: string;
}

export function Phase3AdvancedFilter({
  fieldLabel,
  onApply,
  options,
  title,
  value,
}: Phase3AdvancedFilterProps) {
  const [draft, setDraft] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilter = value !== "all";

  function prepare(open: boolean) {
    if (open) setDraft(value);
    setIsOpen(open);
  }

  function apply() {
    onApply(draft);
    setIsOpen(false);
  }

  function clear() {
    setDraft(value);
  }

  return (
    <FilterDialog
      activeFilterCount={hasActiveFilter ? 1 : 0}
      isOpen={isOpen}
      onApply={apply}
      onClear={clear}
      onOpenChange={prepare}
      title={title}
    >
      <FilterDialogGroup label="Refinar resultados">
        <FilterDialogRow label={fieldLabel}>
          <Select
            label={fieldLabel}
            onValueChange={(nextValue) => setDraft(nextValue ?? "all")}
            options={options}
            value={draft}
          />
        </FilterDialogRow>
      </FilterDialogGroup>
    </FilterDialog>
  );
}
