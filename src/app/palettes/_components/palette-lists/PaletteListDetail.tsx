import { PaletteGroupView } from "../../_utils/constants";
import type { PaletteItem } from "../../types";
import PaletteCardListDetail from "../palette-cards/PaletteCardListDetail";
import GroupHeader from "./GroupHeader";

interface PaletteListDetailProps {
  palettes: PaletteItem[];
  groupView: PaletteGroupView;
}

const PaletteListDetail = ({ palettes, groupView }: PaletteListDetailProps) => {
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
        <div className="flex flex-col space-y-4">
          {palettes.map((palette) => (
            <PaletteCardListDetail key={palette.id} palette={palette} />
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
          <div className="flex flex-col space-y-4">
            {group.images.map((palette) => (
              <PaletteCardListDetail key={palette.id} palette={palette} />
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
            {ungrouped.map((palette) => (
              <PaletteCardListDetail key={palette.id} palette={palette} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PaletteListDetail;