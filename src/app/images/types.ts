import type { Group, Images, Tag, TagsOnImages } from "@prisma/client";

import { ImageGroupView, ImageView } from "./_utils/constants";

export type ImageItem = Images & {
  group: Group | null;
  tags: (TagsOnImages & {
    tag: Tag;
  })[];
}

export interface ImageFilters {
  view: ImageView;
  groupView: ImageGroupView;
  search: {
    keyword?: string;
    groupId?: string;
    group?: Group;
    tagIds?: string[];
    tags?: Tag[];
  };
}