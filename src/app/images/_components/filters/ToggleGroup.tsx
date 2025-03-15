"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { ImageGroupView } from "../../constants";

interface ToggleViewProps {
  defaultValue: ImageGroupView;
}

const ToggleGroupView = ({ defaultValue }: ToggleViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: ImageGroupView) => {
    if (!value) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("groupView", value);
    router.push(`/images?${params.toString()}`);
  };

  return (
    <ToggleGroup
      type="single"
      size="lg"
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
    >
      <ToggleGroupItem value={ImageGroupView.SINGLE} title="Single view" aria-label="Toggle single" className="cursor-pointer">
        Single
      </ToggleGroupItem>
      <ToggleGroupItem value={ImageGroupView.GROUPED} title="Grouped view" aria-label="Toggle grouped" className="cursor-pointer">
        Grouped
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default ToggleGroupView;