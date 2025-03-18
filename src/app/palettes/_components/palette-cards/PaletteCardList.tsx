'use client';

import { Badge } from "@/components/ui/badge";

import type { PaletteItem } from "../../types";
import PaletteActionButtonGroup from "../actions/PaletteActionButtonGroup";

interface PaletteCardListProps {
  palette: PaletteItem;
}

const PaletteCardList = ({ palette }: PaletteCardListProps) => {
  return (
    <div
      key={palette.id}
      role="button"
      className="flex gap-4 px-4 py-3 bg-muted rounded-md items-center"
    >
      <div className="relative h-24 w-[200px] flex-shrink-0 rounded-md overflow-hidden">
        {palette.colors && palette.colors.length > 0 ? (
          <div className="h-full w-full flex flex-col">
            <div className="flex-grow flex overflow-hidden rounded-md">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-grow h-full transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            No colors
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-md font-medium line-clamp-1">{palette.name}</h2>
          {palette.group && (
            <Badge
              className="max-w-32 truncate bg-white text-black"
              title={palette.group.name}
            >
              {palette.group.name}
            </Badge>
          )}
        </div>

        {palette.comments && (
          <p className="text-sm text-muted-foreground line-clamp-2 max-w-4xl">{palette.comments}</p>
        )}
      </div>

      <PaletteActionButtonGroup palette={palette} />
    </div>
  );
}

export default PaletteCardList;