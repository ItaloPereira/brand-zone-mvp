'use client';

import { Calendar, Download, Eye, Hash, Pencil, Tag, Trash } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { ImageItem } from "../../types";

interface ImageCardListDetailProps {
  image: ImageItem;
}

const ImageCardListDetail = ({ image }: ImageCardListDetailProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div
      key={image.id}
      className="flex gap-6 px-6 py-4 bg-muted rounded-md"
    >
      <div className="relative h-56 w-80 flex-shrink-0 rounded-md overflow-hidden">
        <Image src={image.src} alt={image.name} fill className="object-cover" />
      </div>

      <div className="flex-grow min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium mb-2">{image.name}</h2>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Modified {formatDate(image.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                <span>{image.id.slice(0, 8)}</span>
              </div>
            </div>

            {image.comments && (
              <p className="text-sm text-muted-foreground mb-4 max-w-4xl line-clamp-3">{image.comments}</p>
            )}
          </div>

          <div className="flex items-start gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-600"
              title="View"
              aria-label="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-600"
              title="Download"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-600"
              title="Edit"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-600"
              title="Delete"
              aria-label="Delete"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-4 bg-muted-foreground/50 mt-auto" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 max-w-[70%] overflow-x-auto">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 pb-1">
              {image.group && (
                <Badge
                  variant="secondary"
                  className="px-2 py-0.5 bg-amber-800 text-amber-100"
                >
                  {image.group.name}
                </Badge>
              )}
              {image.tags.map((tagItem) => (
                <Badge
                  key={tagItem.id}
                  variant="outline"
                  className="px-2 py-0.5 border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
                >
                  {tagItem.tag.name}
                </Badge>
              ))}
              {(!image.group && image.tags.length === 0) && (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="h-4 bg-muted-foreground/50" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="text-sm">{formatDate(image.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCardListDetail;