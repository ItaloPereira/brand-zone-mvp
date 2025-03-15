"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";

import { formatAppliedFilters } from "../../_utils/filters";
import type { ImageFilters } from "../../types";

interface AppliedFiltersProps {
  filters: ImageFilters;
}

const AppliedFilters = ({ filters }: AppliedFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appliedFilters = formatAppliedFilters(filters);

  if (!appliedFilters.length) {
    return null;
  }

  const handleRemove = (type: string, id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    switch (type) {
      case "keyword":
        params.delete("keyword");
        break;
      case "group":
        params.delete("groupId");
        break;
      case "tag": {
        const currentTags = params.get("tagIds")?.split(",").filter(Boolean) || [];
        const newTags = currentTags.filter(tagId => tagId !== id);

        if (newTags.length === 0) {
          params.delete("tagIds");
        } else {
          params.set("tagIds", newTags.join(","));
        }
        break;
      }
    }

    router.push(`/images?${params.toString()}`);
  };

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
            onClick={() => handleRemove(filter.type, filter.id)}
            className="hover:bg-neutral-700 rounded p-0.5 cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {filter.type} filter</span>
          </button>
        </Badge>
      ))}
    </div>
  );
}

export default AppliedFilters; 