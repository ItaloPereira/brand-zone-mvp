"use client";

import { Link2, PlusIcon, Sparkles, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DialogType } from "../constants";
import AddImageDialogTrigger from "./AddImageDialogTrigger";

const AddImageButton = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button>
          <PlusIcon />
          Add image
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-muted px-0" align="end">
        <div className="flex flex-col">
          <AddImageDialogTrigger
            dialogTitle="Upload image from URL"
            buttonLabel="URL"
            buttonIcon={<Link2 />}
            type={DialogType.URL}
            setPopoverOpen={setPopoverOpen}
          />

          <AddImageDialogTrigger
            dialogTitle="Upload image"
            buttonLabel="Upload"
            buttonIcon={<Upload />}
            type={DialogType.UPLOAD}
            setPopoverOpen={setPopoverOpen}
          />

          <AddImageDialogTrigger
            dialogTitle="Generate image"
            buttonLabel="Generate"
            buttonIcon={<Sparkles className="text-purple-500" />}
            buttonLabelClassName="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent"
            type={DialogType.GENERATE}
            setPopoverOpen={setPopoverOpen}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddImageButton;
