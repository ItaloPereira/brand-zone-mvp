'use client';

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ImageActionButtonProps } from "./types";

export const DownloadButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  image
}: ImageActionButtonProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `${image.name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
      title="Download"
      aria-label="Download"
      onClick={handleDownload}
    >
      <Download className={variant === "popover" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
      {variant === "popover" && "Download"}
    </Button>
  );
}; 