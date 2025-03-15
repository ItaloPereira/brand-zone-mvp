"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useImages } from "../../context/ImagesContext";
import AddImageForm from "../forms/AddImageForm";

const AddImageFromUrlTriger = () => {
  const { availableGroups, availableTags } = useImages();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
        >
          <Link2 />
          URL
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload image from URL</DialogTitle>
        </DialogHeader>
        <AddImageForm
          availableGroups={availableGroups}
          availableTags={availableTags}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddImageFromUrlTriger;