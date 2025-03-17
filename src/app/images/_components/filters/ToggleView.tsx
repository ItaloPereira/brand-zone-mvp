"use client";

import { Grid, List, ListCollapse } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { ImageView } from "../../_utils/constants";

interface ToggleViewProps {
  defaultValue: ImageView;
}

const ToggleView = ({ defaultValue }: ToggleViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: ImageView) => {
    if (!value) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    router.push(`/images?${params.toString()}`);
  };

  return (
    <ToggleGroup
      type="single"
      size="lg"
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
    >
      <ToggleGroupItem value={ImageView.GRID} title="Grid view" aria-label="Toggle grid" className="cursor-pointer">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={ImageView.LIST} title="List view" aria-label="Toggle list" className="cursor-pointer">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={ImageView.DETAILS} title="Details view" aria-label="Toggle details" className="cursor-pointer">
        <ListCollapse className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default ToggleView;