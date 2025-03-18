'use client';

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { ImageActionButtonProps } from "./types";

const DownloadButton = ({
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

      try {
        const response = await fetch(image.src, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Accept': 'image/*'
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          await saveFile(blob);
          return;
        }
      } catch (directError) {
        console.warn("Direct download failed, trying alternative method:", directError);
      }

      if (image.src.includes('cloudinary.com')) {
        const cloudinaryUrl = getCloudinaryFallbackUrl(image.src);
        try {
          const response = await fetch(cloudinaryUrl);
          if (response.ok) {
            const blob = await response.blob();
            await saveFile(blob);
            return;
          }
        } catch (cloudinaryError) {
          console.warn("Cloudinary fallback failed:", cloudinaryError);
        }
      }

      try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(image.src)}`;
        const response = await fetch(proxyUrl);

        if (response.ok) {
          const blob = await response.blob();
          await saveFile(blob);
          return;
        } else {
          console.warn("Proxy download failed:", await response.text());
        }
      } catch (proxyError) {
        console.warn("Proxy download failed:", proxyError);
      }

      const link = document.createElement('a');
      link.href = image.src;
      link.download = `${image.name || 'image'}.${getFileExtension(image.src)}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Redirecionado para download de ${image.name || 'Image'}`);

      if (onClick) onClick();
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const saveFile = async (blob: Blob) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${image.name || 'image'}.${getFileExtension(image.src)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    if (onClick) onClick();

    toast.success(`${image.name || 'Image'} downloaded successfully`);
  };

  const getCloudinaryFallbackUrl = (url: string): string => {
    try {
      const urlParts = url.split('/upload/');
      if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;
      }
    } catch (e) {
      console.warn("Error creating Cloudinary fallback URL:", e);
    }
    return url;
  };

  const getFileExtension = (url: string): string => {
    const pathMatch = url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1].toLowerCase();
    }

    if (url.includes('image/jpeg') || url.includes('image/jpg')) return 'jpg';
    if (url.includes('image/png')) return 'png';
    if (url.includes('image/gif')) return 'gif';
    if (url.includes('image/webp')) return 'webp';

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

export default DownloadButton;
