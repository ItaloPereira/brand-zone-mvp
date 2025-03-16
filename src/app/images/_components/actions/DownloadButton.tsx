'use client';

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { ImageActionButtonProps } from "./types";

export const DownloadButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  image
}: ImageActionButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Fetch the image as a blob
      const response = await fetch(image.src);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${image.name || 'image'}.${getFileExtension(image.src)}`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      if (onClick) onClick();

      toast.success(`${image.name || 'Image'} downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get file extension from URL
  const getFileExtension = (url: string): string => {
    // Try to extract extension from URL path
    const pathMatch = url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1].toLowerCase();
    }

    // Check content-type in URL if present
    if (url.includes('image/jpeg') || url.includes('image/jpg')) return 'jpg';
    if (url.includes('image/png')) return 'png';
    if (url.includes('image/gif')) return 'gif';
    if (url.includes('image/webp')) return 'webp';

    // Default to jpg if no extension found
    return 'jpg';
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
      disabled={isDownloading}
    >
      <Download className={`${variant === "popover" ? "h-4 w-4 mr-2" : "h-4 w-4"} ${isDownloading ? "animate-pulse" : ""}`} />
      {variant === "popover" && (isDownloading ? "Downloading..." : "Download")}
    </Button>
  );
}; 