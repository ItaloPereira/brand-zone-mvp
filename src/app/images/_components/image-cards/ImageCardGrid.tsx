'use client';

import { MessageCircleMore } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { ImageItem } from "../../types";
import { ImageActionsPopover } from "../actions/ImageActionsPopover";

interface ImageGridCardProps {
  image: ImageItem;
}

const ImageGridCard = ({ image }: ImageGridCardProps) => {
  const [openComments, setOpenComments] = useState(false);

  return (
    <div
      key={image.id}
      className="aspect-[4/3] px-3 pb-3 bg-muted rounded-md"
    >
      <div className="flex justify-between items-center py-2">
        <h2 className="text-md line-clamp-1 font-medium">{image.name}</h2>
        <ImageActionsPopover image={image} />
      </div>
      <div className="relative h-full rounded-xs overflow-hidden">
        <Image src={image.src} alt={image.name} fill className="object-cover" />
        {(image.group || image.comments) && (
          <div className="absolute top-2 right-2 bottom-2 flex flex-col gap-2 items-end justify-between">
            {image.group && (
              <Badge
                className="max-w-32 truncate bg-white text-black"
                title={image.group.name}
              >
                {image.group.name}
              </Badge>
            )}
            {image.comments && (
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
                    <p className="text-sm">{image.comments}</p>
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

export default ImageGridCard;