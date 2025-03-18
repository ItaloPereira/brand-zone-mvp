'use client';

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import type { ImageItem } from "../../types";
import ImageActionButtonGroup from "../actions/ImageActionButtonGroup";

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
          <h2 className="text-md font-medium line-clamp-1">{image.name}</h2>
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

      <ImageActionButtonGroup image={image} />
    </div>
  );
}

export default ImageCardList;