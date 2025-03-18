'use client';

import { MessageCircleMore } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { PaletteItem } from "../../types";
import PaletteActionsPopover from "../actions/PaletteActionsPopover";

interface PaletteCardGridProps {
  palette: PaletteItem;
}

const PaletteCardGrid = ({ palette }: PaletteCardGridProps) => {
  const [openComments, setOpenComments] = useState(false);

  return (
    <div
      key={palette.id}
      className="aspect-[4/2] px-3 pb-3 bg-muted rounded-md"
    >
      <div className="flex justify-between items-center py-2">
        <h2 className="text-md line-clamp-1 font-medium">{palette.name}</h2>
        <PaletteActionsPopover palette={palette} />
      </div>
      <div className="relative h-full rounded-xs overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full flex flex-col">
            {palette.colors && palette.colors.length > 0 ? (
              <div className="flex-grow flex overflow-hidden rounded-md">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-grow transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No colors
              </div>
            )}
          </div>
        </div>

        {(palette.group || palette.comments) && (
          <div className="absolute top-2 right-2 bottom-2 flex flex-col gap-2 items-end justify-between">
            {palette.group && (
              <Badge
                className="max-w-32 truncate bg-white text-black"
                title={palette.group.name}
              >
                {palette.group.name}
              </Badge>
            )}
            {palette.comments && (
              <Popover open={openComments} onOpenChange={setOpenComments}>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    aria-label="More options"
                    className="mt-auto bg-white text-black hover:bg-white/80"
                    onMouseEnter={() => setOpenComments(true)}
                    onMouseLeave={() => setOpenComments(false)}
                  >
                    <MessageCircleMore />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="bg-muted max-w-xl w-fit"
                  align="start"
                  side="bottom"
                  onMouseEnter={() => setOpenComments(true)}
                  onMouseLeave={() => setOpenComments(false)}
                >
                  <div className="flex flex-col">
                    <p className="text-sm">{palette.comments}</p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaletteCardGrid;