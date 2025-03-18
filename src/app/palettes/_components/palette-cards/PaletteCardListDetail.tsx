'use client';

import { Calendar, Hash, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { PaletteItem } from "../../types";
import PaletteActionButtonGroup from "../actions/PaletteActionButtonGroup";

interface PaletteCardListDetailProps {
  palette: PaletteItem;
}

const PaletteCardListDetail = ({ palette }: PaletteCardListDetailProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div
      key={palette.id}
      className="flex gap-6 px-6 py-4 bg-muted rounded-md"
    >
      <div className="relative h-56 w-[500px] flex-shrink-0 rounded-md overflow-hidden">
        {palette.colors && palette.colors.length > 0 ? (
          <div className="h-full w-full flex flex-col">
            <div className="h-1/2 flex overflow-hidden rounded-md mb-4">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-grow h-full transition-all"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="h-1/2 grid grid-cols-2 gap-3 overflow-y-auto pr-2">
              {palette.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-md shadow-sm border border-background/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono opacity-70">{color.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No colors in this palette
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium mb-2 line-clamp-1">{palette.name}</h2>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Modified {formatDate(palette.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                <span>{palette.id.slice(0, 8)}</span>
              </div>
            </div>

            {palette.comments && (
              <p className="text-sm text-muted-foreground mb-4 max-w-4xl line-clamp-3">{palette.comments}</p>
            )}
          </div>

          <PaletteActionButtonGroup className="flex items-start gap-2 flex-shrink-0" palette={palette} />
        </div>

        <Separator className="my-4 bg-muted-foreground/50 mt-auto" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 max-w-[70%] overflow-x-auto">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 pb-1">
              {palette.group && (
                <Badge
                  variant="secondary"
                  className="px-2 py-0.5  bg-white text-black"
                >
                  {palette.group.name}
                </Badge>
              )}
              {palette.tags.map((tagItem) => (
                <Badge
                  key={tagItem.id}
                  variant="outline"
                  className="px-2 py-0.5 border-green-500/50 text-green-200"
                >
                  {tagItem.tag.name}
                </Badge>
              ))}
              {(!palette.group && palette.tags.length === 0) && (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="h-4 bg-muted-foreground/50" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="text-sm">{formatDate(palette.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaletteCardListDetail;