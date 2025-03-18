"use client";

import { FolderPlus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GroupStatistic } from "@/data/statistics";

interface GroupStatisticsChartProps {
  groups: GroupStatistic[];
}

const GroupStatisticsChart = ({ groups }: GroupStatisticsChartProps) => {
  if (groups.length === 0) {
    return (
      <Card className="col-span-3 flex flex-col items-center justify-center text-center p-8 border border-border/40 shadow-sm">
        <div className="rounded-full bg-muted p-5 mb-8 mx-auto">
          <FolderPlus className="h-14 w-14 text-muted-foreground" />
        </div>
        <div className="space-y-5 max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-semibold">No Groups Available</h2>
          <p className="text-base text-muted-foreground">
            You haven&apos;t created any groups yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Groups help you organize your assets by project, campaign, or any category you need. Create a group to start organizing your assets.
          </p>
        </div>
      </Card>
    );
  }

  const topGroups = groups.slice(0, 10);

  const chartData = topGroups.map((group) => ({
    name: group.name,
    images: group.imagesCount,
    palettes: group.palettesCount,
    total: group.totalCount,
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Groups Usage</CardTitle>
        <CardDescription>Top 10 groups by total assets count</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="combined">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="combined">Combined</TabsTrigger>
            <TabsTrigger value="total">Total</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="palettes">Palettes</TabsTrigger>
          </TabsList>

          <TabsContent value="combined" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="images" name="Images" fill="#4F46E5" />
                  <Bar dataKey="palettes" name="Palettes" fill="#A855F7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="total" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="total" name="Total Assets" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="images" name="Images" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="palettes" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="palettes" name="Palettes" fill="#A855F7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GroupStatisticsChart; 