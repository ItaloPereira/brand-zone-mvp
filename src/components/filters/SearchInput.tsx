"use client";

import { Search } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch: (value: string) => void;
  defaultValue: string;
}

const SearchInput = ({ onSearch, defaultValue }: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
  };

  return (
    <div className="relative w-[250px]">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by image name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-8 dark:bg-background"
      />
    </div>
  );
}

export default SearchInput; 