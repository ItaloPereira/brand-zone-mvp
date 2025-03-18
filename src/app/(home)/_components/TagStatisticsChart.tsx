"use client";

import { Tag } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TagStatistic } from "@/data/statistics";

interface TagStatisticsChartProps {
  tags: TagStatistic[];
}

const COLORS = ["#4F46E5", "#06B6D4", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#0EA5E9", "#10B981"];

const TagStatisticsChart = ({ tags }: TagStatisticsChartProps) => {
  if (tags.length === 0) {
    return (
      <Card className="col-span-3 flex flex-col items-center justify-center text-center p-8 border border-border/40 shadow-sm">
        <div className="rounded-full bg-muted p-5 mb-8 mx-auto">
          <Tag className="h-14 w-14 text-muted-foreground" />
        </div>
        <div className="space-y-5 max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-semibold">No Tags Available</h2>
          <p className="text-base text-muted-foreground">
            You haven&apos;t created any tags yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Tags help you categorize and search for your assets. Add tags to your images and palettes to see statistics here.
          </p>
        </div>
      </Card>
    );
  }

  const topTags = tags.slice(0, 10);

  const chartData = topTags.map((tag) => ({
    name: tag.name,
    value: tag.totalCount,
  }));

  const barData = topTags.map((tag) => ({
    name: tag.name,
    images: tag.imagesCount,
    palettes: tag.palettesCount,
    total: tag.totalCount,
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Popular Tags</CardTitle>
        <CardDescription>Top 10 most used tags</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="total">Total</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="palettes">Palettes</TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="total" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="total" name="Total Usage" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
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
                  data={barData}
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

export default TagStatisticsChart; 