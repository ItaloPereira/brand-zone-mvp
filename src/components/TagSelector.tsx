"use client";

import type { Tag } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useState } from "react";

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

export interface TagValue {
  id: string;
  name: string;
  isNew: boolean;
}

interface TagSelectorProps {
  value: TagValue[];
  onChange: (value: TagValue[]) => void;
  availableTags: Tag[];
  setAvailableTags?: (tags: Tag[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TagSelector = ({
  value,
  onChange,
  availableTags,
  setAvailableTags,
  placeholder = "Select tags",
  disabled = false,
}: TagSelectorProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddNewTag = useCallback((name: string) => {
    const tempId = `temp_${Date.now()}`;
    const newTag = {
      id: tempId,
      name,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (setAvailableTags) {
      setAvailableTags([...availableTags, newTag]);
    }

    return newTag;
  }, [availableTags, setAvailableTags]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value?.length && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value?.length
            ? `${value.length} tag${value.length === 1 ? "" : "s"} selected`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: 'var(--radix-popper-anchor-width)' }} align="start">
        <Command className="w-full">
          <CommandInput
            placeholder="Search tags..."
            onValueChange={setInputValue}
            value={inputValue}
          />
          <CommandList>
            <CommandEmpty className="py-0">
              <Button
                variant="ghost"
                className="justify-start w-full px-2 py-1.5"
                onClick={() => {
                  const tagName = inputValue.trim();
                  if (tagName) {
                    const newTag = handleAddNewTag(tagName);
                    onChange([
                      ...value,
                      {
                        id: newTag.id,
                        name: tagName,
                        isNew: true,
                      }
                    ]);
                    setInputValue("");
                  }
                }}
              >
                {availableTags.length === 0 && !inputValue.trim()
                  ? "Add your first tag typing above"
                  : `Add "${inputValue.trim()}"`}
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {availableTags.map((tag) => (
                <CommandItem
                  value={tag.name}
                  key={tag.id}
                  onSelect={() => {
                    const isSelected = value.some(t => t.id === tag.id);
                    if (isSelected) {
                      onChange(value.filter(t => t.id !== tag.id));
                    } else {
                      onChange([
                        ...value,
                        {
                          id: tag.id,
                          name: tag.name,
                          isNew: tag.id.startsWith("temp_"),
                        }
                      ]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.some(t => t.id === tag.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 