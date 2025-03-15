"use client";

import type { Group } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
}

const GroupSelect = ({ availableGroups }: GroupSelectProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentGroupId = searchParams.get("groupId");
  const currentGroup = availableGroups.find(group => group.id === currentGroupId);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("groupId");
    } else {
      params.set("groupId", value);
    }

    setOpen(false);
    router.push(`/images?${params.toString()}`);
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
                  !currentGroupId ? "opacity-100" : "opacity-0"
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
                    currentGroupId === group.id ? "opacity-100" : "opacity-0"
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