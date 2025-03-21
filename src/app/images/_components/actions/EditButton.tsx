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

import EditImageForm from "../forms/EditImageForm";
import type { ImageActionButtonProps } from "./types";

const EditButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  image
}: ImageActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleDialogClose = () => {
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>

          <EditImageForm
            image={image}
            dialogOpen={isOpen}
            setDialogOpen={setIsOpen}
            onSuccess={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditButton;
