import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ImageGroupView, ImageView } from "../constants";
import type { ImageItem } from "../types";
import ToggleGroupView from "./filters/ToggleGroup";
import ToggleView from "./filters/ToggleView";
import ImageGrid from "./image-lists/ImageGrid";
import ImageList from "./image-lists/ImageList";
import ImageListDetail from "./image-lists/ImageListDetail";

interface ImagesModuleProps {
  images: ImageItem[];
  view: ImageView;
  groupView: ImageGroupView;
}

const ImagesModule = ({ images, view, groupView }: ImagesModuleProps) => {
  const renderList = () => {
    switch (view) {
      case ImageView.GRID:
        return <ImageGrid images={images} groupView={groupView} />;

      case ImageView.LIST:
        return <ImageList images={images} groupView={groupView} />;

      case ImageView.DETAILS:
        return <ImageListDetail images={images} groupView={groupView} />;

      default:
        return <ImageGrid images={images} groupView={groupView} />;
    }
  }

  return (
    <>
      <section className="px-8 py-6 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold">Images</h1>
        <Button>
          <PlusIcon />
          Add image
        </Button>
      </section>

      <section className="px-8 py-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          Filters
        </div>

        <div className="flex gap-4">
          <ToggleGroupView defaultValue={groupView} />
          <ToggleView defaultValue={view} />
        </div>
      </section>

      {renderList()}
    </>
  );
}

export default ImagesModule;