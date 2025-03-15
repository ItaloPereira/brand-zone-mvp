import { GroupIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface GroupHeaderProps {
  name: string;
  count: number;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const GroupHeader = ({ name, count }: GroupHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between w-full px-2 py-1">
        <div className="flex items-center gap-2">
          <GroupIcon className="h-4 w-4" />
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm text-muted-foreground">{count} images</span>
      </div>
      <Separator className="bg-muted-foreground/50" />
    </div>
  );
}; 