"use client";

import { BarChartIcon, CameraIcon, FolderIcon, TagIcon } from "lucide-react";

import type { StatisticsSummary as StatsSummaryType } from "@/data/statistics";

import StatisticsCard from "./StatisticsCard";

interface StatisticsSummaryProps {
  summary: StatsSummaryType;
}

const StatisticsSummary = ({ summary }: StatisticsSummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticsCard
        title="Total Images"
        value={summary.totalImages}
        icon={CameraIcon}
        description="Total number of images in your collection"
        className="shadow-md shadow-blue-500/10"
      />
      <StatisticsCard
        title="Total Palettes"
        value={summary.totalPalettes}
        icon={BarChartIcon}
        description="Total number of color palettes created"
        className="shadow-md shadow-purple-500/10"
      />
      <StatisticsCard
        title="Total Groups"
        value={summary.totalGroups}
        icon={FolderIcon}
        description="Number of organizational groups"
        className="shadow-md shadow-amber-500/10"
      />
      <StatisticsCard
        title="Total Tags"
        value={summary.totalTags}
        icon={TagIcon}
        description="Number of unique tags used"
        className="shadow-md shadow-emerald-500/10"
      />
    </div>
  );
};

export default StatisticsSummary; 