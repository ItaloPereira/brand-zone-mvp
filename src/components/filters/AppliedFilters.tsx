"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";


interface AppliedFiltersProps<T> {
  appliedFilters: T[];
  onRemove: (filter: T) => void;
}

const AppliedFilters = <T extends { type: string; id: string; label: string }>({ appliedFilters, onRemove }: AppliedFiltersProps<T>) => {
  if (!appliedFilters.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {appliedFilters.map(filter => (
        <Badge
          key={`${filter.type}-${filter.id}`}
          variant="secondary"
          className="pl-2 pr-1 py-1 gap-1"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter)}
            className="hover:bg-neutral-700 rounded p-0.5 cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {filter.label} filter</span>
          </button>
        </Badge>
      ))}
    </div>
  );
}

export default AppliedFilters; 