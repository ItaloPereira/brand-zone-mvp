import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatisticsLoading = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 my-1" />
              <Skeleton className="h-3 w-full max-w-[180px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <TabsTrigger key={i} value={`tab${i + 1}`} disabled>
                    <Skeleton className="h-4 w-16" />
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="tab1" className="space-y-4">
                <div className="h-[300px] w-full pt-4 flex items-center justify-center">
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <TabsTrigger key={i} value={`tab${i + 1}`} disabled>
                    <Skeleton className="h-4 w-16" />
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="tab1" className="space-y-4">
                <div className="h-[300px] w-full pt-4 flex items-center justify-center">
                  <Skeleton className="h-[250px] w-[250px] rounded-full mx-auto" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsLoading; 