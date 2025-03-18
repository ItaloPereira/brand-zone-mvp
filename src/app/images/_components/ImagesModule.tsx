"use client";

import { ListCollapse } from "lucide-react";
import { List } from "lucide-react";
import { Grid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import GroupSelect from "@/components/filters/GroupSelect";
import SearchInput from "@/components/filters/SearchInput";
import TagsSelect from "@/components/filters/TagsSelect";
import ToggleGroupView from "@/components/filters/ToggleGroup";
import ToggleView from "@/components/filters/ToggleView";
import ResourceModule from "@/components/layout/ResourceModule";
import { Button } from "@/components/ui/button";

import { useImages } from "../_context/ImagesContext";
import { ImageGroupView, ImageView } from "../_utils/constants";
import { AppliedFilter, formatAppliedImageFilters } from "../_utils/filters";
import type { ImageFilters, ImageItem } from "../types";
import AddImageButton from "./actions/AddImageButton";
import AppliedFilters from "./filters/AppliedFilters";
import ImageGrid from "./image-lists/ImageGrid";
import ImageList from "./image-lists/ImageList";
import ImageListDetail from "./image-lists/ImageListDetail";

interface ImagesModuleProps {
  images: ImageItem[];
  filters: ImageFilters;
}

const ImagesModule = ({
  images,
  filters,
}: ImagesModuleProps) => {
  const { availableGroups, availableTags } = useImages();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultGroupId = searchParams.get("groupId") ?? undefined;
  const defaultTagIds = searchParams.get("tagIds")?.split(",").filter(Boolean) || [];
  const defaultKeyword = searchParams.get("keyword") || "";

  const appliedFilters = formatAppliedImageFilters(filters);

  const handleApplyGroup = (group: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (group === "all") {
      params.delete("groupId");
    } else {
      params.set("groupId", group);
    }

    router.push(`/images?${params.toString()}`);
  }

  const handleApplyTags = (tags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tags.length === 0) {
      params.delete("tagIds");
    } else {
      params.set("tagIds", tags.join(","));
    }

    router.push(`/images?${params.toString()}`);
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("keyword", value.trim());
    } else {
      params.delete("keyword");
    }

    router.push(`/images?${params.toString()}`);
  }

  const handleClear = () => {
    const params = new URLSearchParams();

    const view = searchParams.get("view");
    const groupView = searchParams.get("groupView");

    if (view) params.set("view", view);
    if (groupView) params.set("groupView", groupView);

    router.push(`/images${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApplyGroupView = (value: ImageGroupView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("groupView", value);
    router.push(`/images?${params.toString()}`);
  }

  const handleApplyView = (value: ImageView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    router.push(`/images?${params.toString()}`);
  }

  const handleRemoveFilter = (filter: AppliedFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    switch (filter.type) {
      case "keyword":
        params.delete("keyword");
        break;
      case "group":
        params.delete("groupId");
        break;
      case "tag": {
        const currentTags = params.get("tagIds")?.split(",").filter(Boolean) || [];
        const newTags = currentTags.filter(tagId => tagId !== filter.id);

        if (newTags.length === 0) {
          params.delete("tagIds");
        } else {
          params.set("tagIds", newTags.join(","));
        }
        break;
      }
    }

    router.push(`/images?${params.toString()}`);
  }

  return (
    <ResourceModule
      header={
        <>
          <h1 className="text-3xl font-bold">Images</h1>
          <AddImageButton />
        </>
      }
      filters={
        <>
          <GroupSelect
            availableGroups={availableGroups}
            onSelect={handleApplyGroup}
            defaultValue={defaultGroupId}
          />

          <TagsSelect
            availableTags={availableTags}
            onSelect={handleApplyTags}
            defaultValue={defaultTagIds}
          />

          <SearchInput
            onSearch={handleSearch}
            defaultValue={defaultKeyword}
          />

          <Button variant="outline" onClick={handleClear}>
            Clear filters
          </Button>
        </>
      }
      toggles={
        <>
          <ToggleGroupView<ImageGroupView>
            defaultValue={filters.groupView}
            onSelect={handleApplyGroupView}
            options={[
              { value: ImageGroupView.SINGLE, label: "Single" },
              { value: ImageGroupView.GROUPED, label: "Grouped" },
            ]}
          />

          <ToggleView<ImageView>
            defaultValue={filters.view}
            onSelect={handleApplyView}
            options={[
              { value: ImageView.GRID, label: "Grid", icon: <Grid /> },
              { value: ImageView.LIST, label: "List", icon: <List /> },
              { value: ImageView.DETAILS, label: "Details", icon: <ListCollapse /> },
            ]}
          />
        </>
      }
      appliedFilters={
        <AppliedFilters
          appliedFilters={appliedFilters}
          onRemove={handleRemoveFilter}
        />
      }
    >
      {filters.view === ImageView.GRID && (
        <ImageGrid images={images} groupView={filters.groupView} />
      )}
      {filters.view === ImageView.LIST && (
        <ImageList images={images} groupView={filters.groupView} />
      )}
      {filters.view === ImageView.DETAILS && (
        <ImageListDetail images={images} groupView={filters.groupView} />
      )}
    </ResourceModule>
  );
}

export default ImagesModule;