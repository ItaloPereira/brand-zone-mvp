import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorTemplateProps = {
  errorMessage: string;
  reset: () => void;
};

const ErrorTemplate = ({ errorMessage, reset }: ErrorTemplateProps) => {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">
          {errorMessage}
        </p>
      </div>
      <Button
        onClick={reset}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}

export default ErrorTemplate;