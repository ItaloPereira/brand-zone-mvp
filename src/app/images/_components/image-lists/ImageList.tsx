import { ImageGroupView } from "../../constants";
import type { ImageItem } from "../../types";
import { GroupHeader } from "../GroupHeader";
import ImageCardList from "../image-cards/ImageCardList";

interface ImageListProps {
  images: ImageItem[];
  groupView: ImageGroupView;
}

const ImageList = ({ images, groupView }: ImageListProps) => {
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
        <div className="flex flex-col space-y-2">
          {images.map((image) => (
            <ImageCardList key={image.id} image={image} />
          ))}
        </div>
      </section>
    );
  }

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
          <div className="flex flex-col space-y-2">
            {group.images.map((image) => (
              <ImageCardList key={image.id} image={image} />
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
          <div className="flex flex-col space-y-2">
            {ungrouped.map((image) => (
              <ImageCardList key={image.id} image={image} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ImageList;