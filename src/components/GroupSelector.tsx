"use client";

import type { Group } from "@prisma/client";
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

export interface GroupValue {
  id: string;
  name: string;
  isNew: boolean;
}

interface GroupSelectorProps {
  value: GroupValue | undefined;
  onChange: (value: GroupValue | undefined) => void;
  availableGroups: Group[];
  setAvailableGroups?: (groups: Group[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const GroupSelector = ({
  value,
  onChange,
  availableGroups,
  setAvailableGroups,
  placeholder = "Select group",
  disabled = false,
}: GroupSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleAddNewGroup = useCallback((name: string) => {
    const tempId = `temp_${Date.now()}`;
    const newGroup = {
      id: tempId,
      name,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (setAvailableGroups) {
      setAvailableGroups([...availableGroups, newGroup]);
    }

    return newGroup;
  }, [availableGroups, setAvailableGroups]);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value ? value.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: 'var(--radix-popper-anchor-width)' }} align="start">
        <Command className="w-full">
          <CommandInput
            placeholder="Search group..."
            onValueChange={setInputValue}
            value={inputValue}
          />
          <CommandList>
            <CommandEmpty className="py-0">
              <Button
                variant="ghost"
                className="justify-start w-full px-2"
                onClick={() => {
                  const value = inputValue.trim();
                  if (value) {
                    const newGroup = handleAddNewGroup(value);
                    onChange({
                      id: newGroup.id,
                      name: value,
                      isNew: true,
                    });
                    setInputValue("");
                    setPopoverOpen(false);
                  }
                }}
              >
                {availableGroups.length === 0 && !inputValue.trim()
                  ? "Add your first group"
                  : `Add "${inputValue.trim()}"`}
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {availableGroups.map((group) => (
                <CommandItem
                  value={group.name}
                  key={group.id}
                  onSelect={() => {
                    onChange({
                      id: group.id,
                      name: group.name,
                      isNew: group.id.startsWith("temp_"),
                    });
                    setPopoverOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.id === group.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {group.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 