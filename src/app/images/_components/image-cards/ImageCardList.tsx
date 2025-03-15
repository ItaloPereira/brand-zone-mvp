'use client';

import { Download, Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ImageItem } from "../../types";

interface ImageCardListProps {
  image: ImageItem;
}

const ImageCardList = ({ image }: ImageCardListProps) => {
  return (
    <div
      key={image.id}
      role="button"
      className="flex gap-4 px-4 py-3 bg-muted rounded-md items-center"
    >
      <div className="relative h-24 w-32 flex-shrink-0 rounded-md overflow-hidden">
        <Image src={image.src} alt={image.name} fill className="object-cover" />
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-md font-medium truncate">{image.name}</h2>
          {image.group && (
            <Badge
              className="max-w-32 truncate bg-white text-black"
              title={image.group.name}
            >
              {image.group.name}
            </Badge>
          )}
        </div>

        {image.comments && (
          <p className="text-sm text-muted-foreground line-clamp-2 max-w-4xl">{image.comments}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
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
  );
}

export default ImageCardList;