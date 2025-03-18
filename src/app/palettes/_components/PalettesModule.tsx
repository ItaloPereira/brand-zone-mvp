"use client";

import { Grid, List, ListCollapse } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import AppliedFilters from "@/components/filters/AppliedFilters";
import GroupSelect from "@/components/filters/GroupSelect";
import SearchInput from "@/components/filters/SearchInput";
import TagsSelect from "@/components/filters/TagsSelect";
import ToggleGroupView from "@/components/filters/ToggleGroup";
import ToggleView from "@/components/filters/ToggleView";
import ResourceModule from "@/components/layout/ResourceModule";
import { Button } from "@/components/ui/button";
import { useShared } from "@/contexts/SharedContext";

import { PaletteGroupView } from "../_utils/constants";
import { PaletteView } from "../_utils/constants";
import { AppliedFilter, formatAppliedPaletteFilters } from "../_utils/filters";
import type { PaletteFilters } from "../types";
import { PaletteItem } from "../types";
import AddPaletteButton from "./actions/AddPaletteButton";
import PaletteGrid from "./palette-lists/PaletteGrid";
import PaletteList from "./palette-lists/PaletteList";
import PaletteListDetail from "./palette-lists/PaletteListDetail";

interface PalettesModuleProps {
  palettes: PaletteItem[];
  filters: PaletteFilters;
}

const PalettesModule = ({
  palettes,
  filters,
}: PalettesModuleProps) => {
  const { availableGroups, availableTags } = useShared();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultGroupId = searchParams.get("groupId") ?? undefined;
  const defaultTagIds = searchParams.get("tagIds")?.split(",").filter(Boolean) || [];
  const defaultKeyword = searchParams.get("keyword") || "";

  const appliedFilters = formatAppliedPaletteFilters(filters);

  const getParams = () => new URLSearchParams(searchParams.toString());

  const navigateTo = (params: URLSearchParams) => {
    router.push(`/palettes?${params.toString()}`);
  };

  const handleApplyGroup = (group: string) => {
    const params = getParams();

    if (group === "all") {
      params.delete("groupId");
    } else {
      params.set("groupId", group);
    }

    navigateTo(params);
  };

  const handleApplyTags = (tags: string[]) => {
    const params = getParams();

    if (tags.length === 0) {
      params.delete("tagIds");
    } else {
      params.set("tagIds", tags.join(","));
    }

    navigateTo(params);
  };

  const handleSearch = (value: string) => {
    const params = getParams();

    if (value.trim()) {
      params.set("keyword", value.trim());
    } else {
      params.delete("keyword");
    }

    navigateTo(params);
  };

  const handleClear = () => {
    const params = new URLSearchParams();

    const view = searchParams.get("view");
    const groupView = searchParams.get("groupView");

    if (view) params.set("view", view);
    if (groupView) params.set("groupView", groupView);

    router.push(`/images${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApplyView = (value: PaletteView) => {
    const params = getParams();
    params.set("view", value);
    navigateTo(params);
  };

  const handleApplyGroupView = (value: PaletteGroupView) => {
    const params = getParams();
    params.set("groupView", value);
    navigateTo(params);
  };

  const handleRemoveFilter = (filter: AppliedFilter) => {
    const params = getParams();

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

    navigateTo(params);
  };

  const renderPaletteView = () => {
    switch (filters.view) {
      case PaletteView.GRID:
        return <PaletteGrid palettes={palettes} groupView={filters.groupView} />;
      case PaletteView.LIST:
        return <PaletteList palettes={palettes} groupView={filters.groupView} />;
      case PaletteView.DETAILS:
        return <PaletteListDetail palettes={palettes} groupView={filters.groupView} />;
      default:
        return <PaletteGrid palettes={palettes} groupView={filters.groupView} />;
    }
  };

  const viewOptions = [
    { value: PaletteView.GRID, label: "Grid", icon: <Grid /> },
    { value: PaletteView.LIST, label: "List", icon: <List /> },
    { value: PaletteView.DETAILS, label: "Details", icon: <ListCollapse /> },
  ];

  const groupViewOptions = [
    { value: PaletteGroupView.SINGLE, label: "Single" },
    { value: PaletteGroupView.GROUPED, label: "Grouped" },
  ];

  return (
    <ResourceModule
      header={
        <>
          <h1 className="text-3xl font-bold">Palettes</h1>
          <AddPaletteButton />
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
          <ToggleGroupView<PaletteGroupView>
            defaultValue={filters.groupView}
            onSelect={handleApplyGroupView}
            options={groupViewOptions}
          />
          <ToggleView<PaletteView>
            defaultValue={filters.view}
            onSelect={handleApplyView}
            options={viewOptions}
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
      {renderPaletteView()}
    </ResourceModule>
  );
};

export default PalettesModule;