'use client';

import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deletePalette } from "@/actions/palettes/delete-palette";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { PaletteActionButtonProps } from "./types";

const DeleteButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  palette
}: PaletteActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deletePalette(palette.id);

      if (result.success) {
        toast.success("Palette deleted successfully");
        setIsOpen(false);
        if (onClick) onClick();
      } else {
        toast.error(result.error || "Failed to delete palette");
      }
    } catch (error) {
      console.error("Error deleting palette:", error);
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
            <DialogTitle>Delete Palette</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the palette &ldquo;{palette.name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center my-4">
            {palette.colors && palette.colors.length > 0 ? (
              <div className="w-full max-w-md">
                <div className="h-16 flex overflow-hidden rounded-md shadow-md mb-2">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-grow h-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {palette.colors.slice(0, 5).map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="h-8 w-8 rounded-md shadow-sm border border-background/20"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-mono mt-1 opacity-70">{color.toUpperCase()}</span>
                    </div>
                  ))}
                  {palette.colors.length > 5 && (
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      +{palette.colors.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                This palette has no colors
              </div>
            )}
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

export default DeleteButton;