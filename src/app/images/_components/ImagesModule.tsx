import type { Group, Tag } from "@prisma/client";

import { ImageView } from "../constants";
import { ImagesProvider } from "../context/ImagesContext";
import type { ImageFilters, ImageItem } from "../types";
import AddImageButton from "./AddImageButton";
import AppliedFilters from "./filters/AppliedFilters";
import ClearFiltersButton from "./filters/ClearFiltersButton";
import GroupSelect from "./filters/GroupSelect";
import SearchInput from "./filters/SearchInput";
import TagsSelect from "./filters/TagsSelect";
import ToggleGroupView from "./filters/ToggleGroup";
import ToggleView from "./filters/ToggleView";
import ImageGrid from "./image-lists/ImageGrid";
import ImageList from "./image-lists/ImageList";
import ImageListDetail from "./image-lists/ImageListDetail";

interface ImagesModuleProps {
  images: ImageItem[];
  filters: ImageFilters;
  availableGroups: Group[];
  availableTags: Tag[];
}

const ImagesModule = ({
  images,
  filters,
  availableGroups,
  availableTags,
}: ImagesModuleProps) => {
  return (
    <ImagesProvider availableGroups={availableGroups} availableTags={availableTags}>
      <div className="flex flex-col gap-6">
        <section className="px-8 py-6 flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold">Images</h1>
          <AddImageButton />
        </section>

        <section className="px-8 py-2 flex flex-col gap-4">
          <div className="flex justify-between items-center w-full flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <GroupSelect />
              <TagsSelect />
              <SearchInput />
              <ClearFiltersButton />
            </div>

            <div className="flex gap-4">
              <ToggleGroupView defaultValue={filters.groupView} />
              <ToggleView defaultValue={filters.view} />
            </div>
          </div>

          <AppliedFilters filters={filters} />
        </section>

        {filters.view === ImageView.GRID && (
          <ImageGrid images={images} groupView={filters.groupView} />
        )}
        {filters.view === ImageView.LIST && (
          <ImageList images={images} groupView={filters.groupView} />
        )}
        {filters.view === ImageView.DETAILS && (
          <ImageListDetail images={images} groupView={filters.groupView} />
        )}
      </div>
    </ImagesProvider>
  );
}

export default ImagesModule;