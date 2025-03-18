'use client';

import { Calendar, Eye, Hash } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import type { PaletteActionButtonProps } from "./types";

const ViewButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  palette
}: PaletteActionButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleView = () => {
    setOpen(true);
    if (onClick) onClick();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
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
        title="View"
        aria-label="View"
        onClick={handleView}
      >
        <Eye className={variant === "popover" ? "h-4 w-4 mr-2" : "h-4 w-4"} />
        {variant === "popover" && "View"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:!max-w-screen-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{palette.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="w-full min-h-[50vh] bg-black/10 rounded-md overflow-hidden">
              {palette.colors && palette.colors.length > 0 ? (
                <div className="h-full w-full flex flex-col">
                  <div className="h-2/3 flex overflow-hidden rounded-md">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-grow h-full transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="h-1/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-6 overflow-y-auto">
                    {palette.colors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div
                          className="h-16 w-16 rounded-md shadow-md border border-background/20"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-mono">{color.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
                  No colors in this palette
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(palette.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Modified:</span>
                    <span>{formatDate(palette.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID:</span>
                    <span>{palette.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Group</h3>
                {palette.group ? (
                  <Badge
                    variant="secondary"
                    className="px-2 py-0.5 bg-white text-black"
                  >
                    {palette.group.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No group assigned</span>
                )}

                <h3 className="text-lg font-semibold mb-2 mt-4">Tags</h3>
                <div className="flex flex-wrap gap-2 overflow-y-auto pr-2">
                  {palette.tags && palette.tags.length > 0 ? (
                    palette.tags.map((tagItem) => (
                      <Badge
                        key={tagItem.id}
                        variant="outline"
                        className="px-2 py-0.5 border-green-500/50 text-green-200 mb-1"
                      >
                        {tagItem.tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags assigned</span>
                  )}
                </div>
              </div>

              {palette.comments && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Comments</h3>
                  <div className="max-h-[300px] overflow-y-auto pr-2 bg-muted/20 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{palette.comments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewButton;
