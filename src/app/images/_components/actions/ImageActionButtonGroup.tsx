'use client';

import type { ImageItem } from "../../types";
import DeleteButton from "./DeleteButton";
import DownloadButton from "./DownloadButton";
import EditButton from "./EditButton";
import ViewButton from "./ViewButton";

const ImageActionButtonGroup = ({
  className = "flex items-center gap-2 flex-shrink-0",
  image
}: {
  className?: string;
  image: ImageItem;
}) => {
  return (
    <div className={className}>
      <ViewButton image={image} />
      <DownloadButton image={image} />
      <EditButton image={image} />
      <DeleteButton image={image} />
    </div>
  );
};

export default ImageActionButtonGroup;
