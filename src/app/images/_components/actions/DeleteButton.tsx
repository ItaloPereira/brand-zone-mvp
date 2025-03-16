'use client';

import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { deleteImage } from "@/actions/delete-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ImageActionButtonProps } from "./types";

export const DeleteButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  image
}: ImageActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteImage(image.id);

      if (result.success) {
        toast.success("Image deleted successfully");
        setIsOpen(false);
        if (onClick) onClick();
      } else {
        toast.error(result.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant === "popover" ? "ghost" : "ghost"}
        size={size}
        className={variant === "popover"
          ? "hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal w-full"
          : className
        }
        title="Delete"
        aria-label="Delete"
        onClick={handleOpenDialog}
      >
        <Trash className={variant === "popover" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
        {variant === "popover" && "Delete"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the image &ldquo;{image.name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center my-4">
            <div className="relative w-40 h-40 rounded-md overflow-hidden">
              <Image
                src={image.src}
                alt={image.name}
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 