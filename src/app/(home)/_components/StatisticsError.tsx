import { AlertCircle } from "lucide-react";

const StatisticsError = () => {
  return (
    <div className="rounded-md bg-destructive/15 p-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <h2 className="font-medium text-destructive">Error</h2>
      </div>
      <div className="mt-2 pl-7 text-sm text-destructive">
        There was a problem loading the statistics. Please try refreshing the page.
      </div>
    </div>
  );
};

export default StatisticsError; 