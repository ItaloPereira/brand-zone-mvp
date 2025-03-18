import { PaletteGroupView } from "../../_utils/constants";
import type { PaletteItem } from "../../types";
import PaletteCardGrid from "../palette-cards/PaletteCardGrid";
import GroupHeader from "./GroupHeader";

interface PaletteGridProps {
  palettes: PaletteItem[];
  groupView: PaletteGroupView;
}

const PaletteGrid = ({ palettes, groupView }: PaletteGridProps) => {
  if (!palettes.length) {
    return (
      <p className="text-muted-foreground text-center px-8 py-6">
        No results found.
      </p>
    );
  }

  if (groupView !== PaletteGroupView.GROUPED) {
    return (
      <section className="px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {palettes.map((palette) => (
            <PaletteCardGrid key={palette.id} palette={palette} />
          ))}
        </div>
      </section>
    );
  }

  // Group images
  const groups: Record<string, { name: string; images: PaletteItem[] }> = {};
  const ungrouped: PaletteItem[] = [];

  palettes.forEach((palette) => {
    if (palette.group) {
      const groupId = palette.group.id;
      if (!groups[groupId]) {
        groups[groupId] = {
          name: palette.group.name,
          images: []
        };
      }
      groups[groupId].images.push(palette);
    } else {
      ungrouped.push(palette);
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
            {group.images.map((palette) => (
              <PaletteCardGrid key={palette.id} palette={palette} />
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
            {ungrouped.map((palette) => (
              <PaletteCardGrid key={palette.id} palette={palette} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PaletteGrid;