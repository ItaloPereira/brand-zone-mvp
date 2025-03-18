"use client";

import { Group } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

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


interface GroupSelectProps {
  availableGroups: Group[];
  onSelect: (group: string) => void;
  defaultValue?: string;
}

const GroupSelect = ({ availableGroups, onSelect, defaultValue }: GroupSelectProps) => {
  const [open, setOpen] = useState(false);

  const currentGroup = availableGroups.find(group => group.id === defaultValue);

  const handleSelect = (value: string) => {
    setOpen(false);
    onSelect(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[250px] justify-between">
          <span>{currentGroup?.name || "All groups"}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search group..." />
          <CommandList>
            <CommandEmpty>No group found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="All groups"
                onSelect={() => handleSelect("all")}
              >
                <Check className={cn(
                  "mr-2 h-4 w-4",
                  !defaultValue ? "opacity-100" : "opacity-0"
                )} />
                All groups
              </CommandItem>
              {availableGroups.map((group) => (
                <CommandItem
                  key={group.id}
                  value={group.name}
                  onSelect={() => handleSelect(group.id)}
                >
                  <Check className={cn(
                    "mr-2 h-4 w-4",
                    defaultValue === group.id ? "opacity-100" : "opacity-0"
                  )} />
                  {group.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default GroupSelect;