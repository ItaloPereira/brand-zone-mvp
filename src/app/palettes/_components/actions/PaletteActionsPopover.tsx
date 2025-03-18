'use client';

import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import type { PaletteItem } from "../../types";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ViewButton from "./ViewButton";

const PaletteActionsPopover = ({
  palette
}: {
  palette: PaletteItem;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="hover:bg-neutral-600"
          size="icon"
          title="More options"
          aria-label="More options"
        >
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-muted px-0" align="start">
        <div className="flex flex-col">
          <ViewButton variant="popover" palette={palette} />
          <EditButton variant="popover" palette={palette} />
          <DeleteButton variant="popover" palette={palette} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PaletteActionsPopover;
