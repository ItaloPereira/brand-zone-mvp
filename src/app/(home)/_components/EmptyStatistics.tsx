import { BarChart, FolderPlus, PlusCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EmptyStatistics = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
      <Card className="flex flex-col items-start justify-center text-left p-8 border border-border/40 shadow-sm">
        <div className="rounded-full bg-primary/10 p-5 mb-8">
          <BarChart className="h-14 w-14 text-primary" />
        </div>
        <div className="space-y-5 max-w-md mb-8">
          <h2 className="text-2xl font-semibold">No statistics yet</h2>
          <p className="text-base text-muted-foreground">
            Add some images or color palettes to start building your statistics.
          </p>
          <p className="text-sm text-muted-foreground">
            Once you have added some assets, you will see statistics about your collections, tags, and more.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-start">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/images">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Images
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/palettes">
              <FolderPlus className="mr-2 h-5 w-5" />
              Add Palettes
            </Link>
          </Button>
        </div>
      </Card>

      <Card className="border-dashed border-2 flex flex-col items-start justify-center text-left p-8">
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <p className="text-base text-muted-foreground">
            Tips to help you organize your brand assets
          </p>
        </div>
        <div className="w-full">
          <ul className="text-base text-muted-foreground text-left list-disc pl-8 space-y-4">
            <li>Create <strong>groups</strong> to organize your assets by project or theme</li>
            <li>Add <strong>tags</strong> to make your assets easier to find</li>
            <li>Use <strong>comments</strong> to add context to your assets</li>
            <li>Take advantage of the <strong>search and filter</strong> features</li>
            <li>Create <strong>color palettes</strong> for consistent branding</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default EmptyStatistics; 