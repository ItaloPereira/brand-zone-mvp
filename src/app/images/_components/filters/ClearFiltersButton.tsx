"use client";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const ClearFiltersButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClear = () => {
    const params = new URLSearchParams();

    const view = searchParams.get("view");
    const groupView = searchParams.get("groupView");

    if (view) params.set("view", view);
    if (groupView) params.set("groupView", groupView);

    router.push(`/images${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <Button variant="outline" onClick={handleClear}>
      Clear filters
    </Button>
  );
}

export default ClearFiltersButton;