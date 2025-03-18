'use client';

import type { PaletteItem } from "../../types";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ViewButton from "./ViewButton";

const PaletteActionButtonGroup = ({
  className = "flex items-center gap-2 flex-shrink-0",
  palette
}: {
  className?: string;
  palette: PaletteItem;
}) => {
  return (
    <div className={className}>
      <ViewButton palette={palette} />
      <EditButton palette={palette} />
      <DeleteButton palette={palette} />
    </div>
  );
};

export default PaletteActionButtonGroup;
