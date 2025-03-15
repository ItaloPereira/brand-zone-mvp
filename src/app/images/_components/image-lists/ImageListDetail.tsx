import { ImageGroupView } from "../../constants";
import type { ImageItem } from "../../types";
import { GroupHeader } from "../GroupHeader";
import ImageCardListDetail from "../image-cards/ImageCardListDetail";

interface ImageListDetailProps {
  images: ImageItem[];
  groupView: ImageGroupView;
}

const ImageListDetail = ({ images, groupView }: ImageListDetailProps) => {
  if (!images.length) {
    return (
      <p className="text-muted-foreground text-center px-8 py-6">
        No results found. Add your first image to get started.
      </p>
    );
  }

  if (groupView !== ImageGroupView.GROUPED) {
    return (
      <section className="px-8 py-6">
        <div className="flex flex-col space-y-4">
          {images.map((image) => (
            <ImageCardListDetail key={image.id} image={image} />
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
          <div className="flex flex-col space-y-4">
            {group.images.map((image) => (
              <ImageCardListDetail key={image.id} image={image} />
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
          <div className="flex flex-col space-y-4">
            {ungrouped.map((image) => (
              <ImageCardListDetail key={image.id} image={image} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ImageListDetail;