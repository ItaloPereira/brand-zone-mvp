import type { Group, Images, Tag, TagsOnImages } from "@prisma/client";

export type ImageItem = Images & {
  group: Group | null;
  tags: (TagsOnImages & {
    tag: Tag;
  })[];
}