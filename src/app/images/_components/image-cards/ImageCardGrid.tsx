'use client';

import { Download, EllipsisVertical, Eye, MessageCircleMore, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { ImageItem } from "../../types";

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
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
              <Button
                variant="ghost"
                className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
              >
                <Eye />
                View
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
              >
                <Download />
                Download
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
              >
                <Pencil />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-neutral-700 justify-start rounded-none has-[>svg]:px-5 font-normal"
              >
                <Trash />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>

      </div>
      <div className="relative h-full rounded-xs overflow-hidden">
        <Image src={image.src} alt={image.name} fill className="object-cover" />
        {(image.group || image.comments) && (
          <div className="absolute top-2 right-2 bottom-2 flex flex-col gap-2 items-end justify-between">
            {image.group && (
              <Badge
                className="max-w-32 truncate bg-amber-800 text-amber-100"
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
                    className="mt-auto"
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