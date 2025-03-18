import { Suspense } from "react";

import { getGroupStatistics, getStatisticsSummary, getTagStatistics } from "@/data/statistics";

import EmptyStatistics from "./EmptyStatistics";
import GroupStatisticsChart from "./GroupStatisticsChart";
import StatisticsError from "./StatisticsError";
import StatisticsLoading from "./StatisticsLoading";
import StatisticsSummary from "./StatisticsSummary";
import TagStatisticsChart from "./TagStatisticsChart";

const StatisticsDashboard = async () => {
  try {
    const [groupStats, tagStats, summary] = await Promise.all([
      getGroupStatistics(),
      getTagStatistics(),
      getStatisticsSummary(),
    ]);

    const hasNoData =
      summary.totalImages === 0 &&
      summary.totalPalettes === 0 &&
      summary.totalGroups === 0 &&
      summary.totalTags === 0;

    if (hasNoData) {
      return <EmptyStatistics />;
    }

    return (
      <div className="space-y-8">
        <StatisticsSummary summary={summary} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <GroupStatisticsChart groups={groupStats} />
          <TagStatisticsChart tags={tagStats} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load statistics:", error);
    return <StatisticsError />;
  }
};

const HomeDashboard = () => {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your brand assets and statistics
        </p>
      </div>

      <Suspense fallback={<StatisticsLoading />}>
        <StatisticsDashboard />
      </Suspense>
    </div>
  );
};

export default HomeDashboard;