"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("keyword") || "");

  useEffect(() => {
    setValue(searchParams.get("keyword") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("keyword", value.trim());
    } else {
      params.delete("keyword");
    }

    router.push(`/images?${params.toString()}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-[250px]">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search images..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-8 dark:bg-black"
      />
    </div>
  );
}

export default SearchInput; 