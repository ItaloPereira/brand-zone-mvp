import { Group, Tag } from "@prisma/client";

import type { ImageFilters } from "../types";
import { ImageGroupView, ImageView } from "./constants";

export interface GetImageFiltersOptions {
  availableGroups?: Group[];
  availableTags?: Tag[];
}

export interface ImageSearchParams {
  groupId?: string;
  tagIds?: string[];
  keyword?: string;
}

export interface ImageViewParams {
  view: ImageView;
  groupView: ImageGroupView;
}

export interface GetImagesProps {
  groupId?: string;
  tagIds?: string[];
  keyword?: string;
}

export const getImageFilters = (
  searchParams: { [key: string]: string | string[] | undefined } | URLSearchParams,
  options: GetImageFiltersOptions = {}
): ImageFilters => {
  const params = searchParams instanceof URLSearchParams
    ? searchParams
    : new URLSearchParams(
      Object.entries(searchParams)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    );

  const viewParam = params.get("view");
  const groupViewParam = params.get("groupView");

  const view = Object.values(ImageView).includes(viewParam as ImageView)
    ? viewParam as ImageView
    : ImageView.GRID;

  const groupView = Object.values(ImageGroupView).includes(groupViewParam as ImageGroupView)
    ? groupViewParam as ImageGroupView
    : ImageGroupView.SINGLE;

  const keyword = params.get("keyword") || undefined;
  const groupId = params.get("groupId") || undefined;
  const tagIds = params.get("tagIds")?.split(",").filter(Boolean);

  const group = options.availableGroups?.find(g => g.id === groupId);
  const tags = options.availableTags?.filter(t => tagIds?.includes(t.id));

  return {
    view,
    groupView,
    search: {
      keyword,
      groupId,
      group,
      tagIds,
      tags,
    }
  };
};

export type AppliedFilter = { id: string; label: string; type: "keyword" | "group" | "tag" };

export const formatAppliedImageFilters = (filters: ImageFilters): AppliedFilter[] => {
  const appliedFilters: AppliedFilter[] = [];

  if (filters.search.keyword) {
    appliedFilters.push({
      id: "keyword",
      label: `"${filters.search.keyword}"`,
      type: "keyword"
    });
  }

  if (filters.search.group) {
    appliedFilters.push({
      id: filters.search.group.id,
      label: filters.search.group.name,
      type: "group"
    });
  }

  if (filters.search.tags?.length) {
    filters.search.tags.forEach(tag => {
      appliedFilters.push({
        id: tag.id,
        label: tag.name,
        type: "tag"
      });
    });
  }

  return appliedFilters;
};