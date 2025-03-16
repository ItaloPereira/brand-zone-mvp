'use client';

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ImageActionButtonProps } from "./types";

export const EditButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  image
}: ImageActionButtonProps) => {
  const handleEdit = () => {
    console.log(`Edit image: ${image.id}`);
    // Implementation will be added later
    if (onClick) onClick();
  };

  return (
    <Button
      variant={variant === "popover" ? "ghost" : "ghost"}
      size={size}
      className={variant === "popover"
        ? "hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal w-full"
        : className
      }
      title="Edit"
      aria-label="Edit"
      onClick={handleEdit}
    >
      <Pencil className={variant === "popover" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
      {variant === "popover" && "Edit"}
    </Button>
  );
}; 