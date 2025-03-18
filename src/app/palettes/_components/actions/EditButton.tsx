'use client';

import { Edit } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UpsertPaletteForm from "../forms/UpsertPaletteForm";
import type { PaletteActionButtonProps } from "./types";

const EditButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  palette
}: PaletteActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
    if (onClick) onClick();
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
        title="Edit"
        aria-label="Edit"
        onClick={handleOpenDialog}
      >
        <Edit className={variant === "popover" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
        {variant === "popover" && "Edit"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Palette</DialogTitle>
          </DialogHeader>

          <UpsertPaletteForm
            palette={palette}
            dialogOpen={isOpen}
            setDialogOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditButton;
