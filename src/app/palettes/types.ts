import type { ColorPalettes, Group, Tag, TagsOnPalettes } from "@prisma/client";

import { PaletteGroupView, PaletteView } from "./_utils/constants";

export type PaletteItem = ColorPalettes & {
  group: Group | null;
  tags: (TagsOnPalettes & {
    tag: Tag;
  })[];
}

export interface PaletteFilters {
  view: PaletteView;
  groupView: PaletteGroupView;
  search: {
    keyword?: string;
    groupId?: string;
    group?: Group;
    tagIds?: string[];
    tags?: Tag[];
  };
}