import { Group, Tag } from "@prisma/client";

import { ImageGroupView, ImageView } from "../constants";
import type { ImageFilters } from "../types";

interface GetFiltersOptions {
  availableGroups?: Group[];
  availableTags?: Tag[];
}

export const getFilters = (
  searchParams: { [key: string]: string | string[] | undefined } | URLSearchParams,
  options: GetFiltersOptions = {}
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

export const formatAppliedFilters = (filters: ImageFilters) => {
  const appliedFilters: { id: string; label: string; type: "keyword" | "group" | "tag" }[] = [];

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