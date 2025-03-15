"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { DialogType } from "../constants";
import AddImageFromGeneratorForm from "./forms/AddImageFromGeneratorForm";
import AddImageFromUploadForm from "./forms/AddImageFromUploadForm";
import AddImageFromUrlForm from "./forms/AddImageFromUrlForm";

interface AddImageDialogTriggerProps {
  dialogTitle: string;
  buttonLabel: string;
  buttonIcon: React.ReactNode;
  type: DialogType;
  buttonLabelClassName?: string;
  setPopoverOpen: (open: boolean) => void;
}

const AddImageDialogTrigger = ({
  dialogTitle,
  buttonLabel,
  buttonIcon,
  type,
  buttonLabelClassName,
  setPopoverOpen,
}: AddImageDialogTriggerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setPopoverOpen(false);
    }
  };

  const renderForm = () => {
    switch (type) {
      case DialogType.URL:
        return <AddImageFromUrlForm dialogOpen={dialogOpen} setDialogOpen={handleDialogOpenChange} />;
      case DialogType.UPLOAD:
        return <AddImageFromUploadForm dialogOpen={dialogOpen} setDialogOpen={handleDialogOpenChange} />;
      case DialogType.GENERATE:
        return <AddImageFromGeneratorForm dialogOpen={dialogOpen} setDialogOpen={handleDialogOpenChange} />;
      default:
        return <AddImageFromUrlForm dialogOpen={dialogOpen} setDialogOpen={handleDialogOpenChange} />;
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
        >
          {buttonIcon}
          <span className={buttonLabelClassName}>{buttonLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}

export default AddImageDialogTrigger;