"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UpsertPaletteForm from "../forms/UpsertPaletteForm";

const AddPaletteButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Add palette
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add color palette</DialogTitle>
        </DialogHeader>
        <UpsertPaletteForm dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPaletteButton;