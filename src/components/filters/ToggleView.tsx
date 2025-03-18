"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ToggleViewProps<T> {
  defaultValue: T;
  onSelect: (value: T) => void;
  options: {
    value: T;
    label: string;
    icon: React.ReactNode;
  }[];
}

const ToggleView = <T extends string>({ defaultValue, onSelect, options }: ToggleViewProps<T>) => {
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
          {option.icon}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default ToggleView;