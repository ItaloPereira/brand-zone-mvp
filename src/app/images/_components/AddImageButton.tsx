"use client";

import { PlusIcon, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import AddImageFromUrlTriger from "./dialogs/AddImageFromUrlTriger";

const AddImageButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <PlusIcon />
          Add image
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-muted px-0" align="end">
        <div className="flex flex-col">
          <AddImageFromUrlTriger />

          <Button
            variant="ghost"
            className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
          >
            <Upload />
            Upload
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal group"
          >
            <Sparkles className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Generate
            </span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddImageButton;
