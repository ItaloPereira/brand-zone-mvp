"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ToggleViewProps<T> {
  defaultValue: T;
  options: {
    value: T;
    label: string;
  }[];
  onSelect: (value: T) => void;
}

const ToggleGroupView = <T extends string>({ defaultValue, options, onSelect }: ToggleViewProps<T>) => {
  const handleValueChange = (value: T) => {
    if (!value) return;
    onSelect(value);
  };

  return (
    <ToggleGroup
      type="single"
      size="lg"
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
    >
      {options.map((option, index) => (
        <ToggleGroupItem
          key={index}
          value={option.value}
          title={`${option.label} view`}
          aria-label={`Toggle ${option.label}`}
          className="cursor-pointer"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default ToggleGroupView;