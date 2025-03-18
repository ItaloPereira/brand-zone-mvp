import { PaletteGroupView } from "../../_utils/constants";
import type { PaletteItem } from "../../types";
import PaletteCardList from "../palette-cards/PaletteCardList";
import GroupHeader from "./GroupHeader";

interface PaletteListProps {
  palettes: PaletteItem[];
  groupView: PaletteGroupView;
}

const PaletteList = ({ palettes, groupView }: PaletteListProps) => {
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
        <div className="flex flex-col space-y-2">
          {palettes.map((palette) => (
            <PaletteCardList key={palette.id} palette={palette} />
          ))}
        </div>
      </section>
    );
  }

  const groups: Record<string, { name: string; palettes: PaletteItem[] }> = {};
  const ungrouped: PaletteItem[] = [];

  palettes.forEach((palette) => {
    if (palette.group) {
      const groupId = palette.group.id;
      if (!groups[groupId]) {
        groups[groupId] = {
          name: palette.group.name,
          palettes: []
        };
      }
      groups[groupId].palettes.push(palette);
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
            count={group.palettes.length}
          />
          <div className="flex flex-col space-y-2">
            {group.palettes.map((palette) => (
              <PaletteCardList key={palette.id} palette={palette} />
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
            {ungrouped.map((palette) => (
              <PaletteCardList key={palette.id} palette={palette} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PaletteList;