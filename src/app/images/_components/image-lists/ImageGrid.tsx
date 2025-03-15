import { ImageGroupView } from "../../constants";
import type { ImageItem } from "../../types";
import { GroupHeader } from "../GroupHeader";
import ImageCardGrid from "../image-cards/ImageCardGrid";

interface ImageGridProps {
  images: ImageItem[];
  groupView: ImageGroupView;
}

const ImageGrid = ({ images, groupView }: ImageGridProps) => {
  if (!images.length) {
    return (
      <p className="text-muted-foreground text-center px-8 py-6">
        No results found.
      </p>
    );
  }

  if (groupView !== ImageGroupView.GROUPED) {
    return (
      <section className="px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCardGrid key={image.id} image={image} />
          ))}
        </div>
      </section>
    );
  }

  // Group images
  const groups: Record<string, { name: string; images: ImageItem[] }> = {};
  const ungrouped: ImageItem[] = [];

  images.forEach((image) => {
    if (image.group) {
      const groupId = image.group.id;
      if (!groups[groupId]) {
        groups[groupId] = {
          name: image.group.name,
          images: []
        };
      }
      groups[groupId].images.push(image);
    } else {
      ungrouped.push(image);
    }
  });

  return (
    <section className="px-8 py-6 flex flex-col gap-8">
      {Object.entries(groups).map(([groupId, group]) => (
        <div key={groupId} className="flex flex-col gap-4">
          <GroupHeader
            name={group.name}
            count={group.images.length}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.images.map((image) => (
              <ImageCardGrid key={image.id} image={image} />
            ))}
          </div>
        </div>
      ))}
      {ungrouped.length > 0 && (
        <div className="flex flex-col gap-4">
          <GroupHeader
            name="Ungrouped"
            count={ungrouped.length}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ungrouped.map((image) => (
              <ImageCardGrid key={image.id} image={image} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ImageGrid;