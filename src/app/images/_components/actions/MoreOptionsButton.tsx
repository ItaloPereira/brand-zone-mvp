'use client';

import { EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

export const MoreOptionsButton = ({
  className = "hover:bg-neutral-600",
  onClick
}: {
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      size="icon"
      title="More options"
      aria-label="More options"
      onClick={onClick}
    >
      <EllipsisVertical />
    </Button>
  );
}; 