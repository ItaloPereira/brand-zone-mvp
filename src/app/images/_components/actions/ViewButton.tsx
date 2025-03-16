'use client';

import { Calendar, Eye, Hash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import type { ImageActionButtonProps } from "./types";

export const ViewButton = ({
  variant = "icon",
  size = "icon",
  className = "hover:bg-neutral-600",
  onClick,
  image
}: ImageActionButtonProps) => {
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
            <DialogTitle className="text-xl font-bold">{image.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="relative w-full min-h-[50vh] bg-black/10 rounded-md overflow-hidden">
              <Image
                src={image.src}
                alt={image.name}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(image.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Modified:</span>
                    <span>{formatDate(image.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID:</span>
                    <span>{image.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Group</h3>
                {image.group ? (
                  <Badge
                    variant="secondary"
                    className="px-2 py-0.5 bg-white text-black"
                  >
                    {image.group.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No group assigned</span>
                )}

                <h3 className="text-lg font-semibold mb-2 mt-4">Tags</h3>
                <div className="flex flex-wrap gap-2 overflow-y-auto pr-2">
                  {image.tags && image.tags.length > 0 ? (
                    image.tags.map((tagItem) => (
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

              {image.comments && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Comments</h3>
                  <div className="max-h-[300px] overflow-y-auto pr-2 bg-muted/20 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{image.comments}</p>
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