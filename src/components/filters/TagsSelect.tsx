"use client";

import { Tag } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TagsSelectProps {
  availableTags: Tag[];
  onSelect: (tags: string[]) => void;
  defaultValue: string[];
}

const TagsSelect = ({ availableTags, onSelect, defaultValue }: TagsSelectProps) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaultValue);

  useEffect(() => {
    const tagIds = searchParams.get("tagIds")?.split(",").filter(Boolean) || [];
    setSelectedTagIds(tagIds);
  }, [searchParams]);

  const selectedTags = availableTags.filter(tag => selectedTagIds.includes(tag.id));

  const handleSelect = (tagId: string) => {
    setSelectedTagIds(current => {
      if (current.includes(tagId)) {
        return current.filter(id => id !== tagId);
      }
      return [...current, tagId];
    });
  };

  const handleApply = () => {
    setOpen(false);
    onSelect(selectedTagIds);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[250px] justify-between">
          <span className="truncate">
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected`
              : "Select tags"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <div className="flex flex-col">
          <Command className="flex-1 overflow-hidden">
            <CommandInput placeholder="Search tags..." />
            <CommandList className="max-h-[calc(300px-80px)] overflow-auto">
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {availableTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag.id)}
                  >
                    <Check className={cn(
                      "mr-2 h-4 w-4",
                      selectedTagIds.includes(tag.id) ? "opacity-100" : "opacity-0"
                    )} />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t p-2 bg-popover sticky bottom-0">
            <Button
              size="sm"
              className="w-full"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TagsSelect; 