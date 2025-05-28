"use client";

import { differenceInDays, format, startOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TaskDateProps {
  value: string;
  className?: string;
  variant?: typeof TaskDateVariant[keyof typeof TaskDateVariant];
}

const TaskDateVariant = {
  FULL: "full",
  DIFF_IN_DAYS: "diffInDays",
} as const;

export const TaskDate = ({ value, className, variant }: TaskDateProps) => {
  const [today, endDate] = [startOfDay(new Date()), startOfDay(new Date(value))];
  const diffInDays = differenceInDays(endDate, today);

  let [fgColor, bgColor] = ["text-backlog-foreground/80 dark:text-backlog/50", "bg-backlog-foreground/10 dark:bg-backlog/20"];
  if (diffInDays < 0) { fgColor = "text-muted-foreground", bgColor = "bg-muted-foreground/10 dark:bg-muted/20"; }
  else if (diffInDays <= 2) { fgColor = "text-red-500"; bgColor = "bg-red-200/75 dark:bg-red-800/50"; }
  else if (diffInDays <= 5) { fgColor = "text-red-400"; bgColor = "bg-red-100/75 dark:bg-red-500/50"; }
  else if (diffInDays <= 7) { fgColor = "text-orange-500"; bgColor = "bg-orange-100/75 dark:bg-orange-800/50"; }
  else if (diffInDays <= 14) { fgColor = "text-orange-400 dark:text-orange-300"; bgColor = "bg-yellow-100/75 dark:bg-yellow-600/50"; }
  ;


  if (variant === TaskDateVariant.DIFF_IN_DAYS) {
    const getDisplayText = () => {
      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Tomorrow";
      if (diffInDays > 1) return `${diffInDays} days left`;
      return `${Math.abs(diffInDays)} days ago`;
    };

    return (
      <div className={cn(fgColor, "text-xs")}>
        <Badge variant="outline" className={cn(bgColor, fgColor, "truncate border-none", className)}>
          <span className={cn("truncate", className)}>{getDisplayText()}</span>
        </Badge>
      </div>
    );
  }

  if (variant === TaskDateVariant.FULL) {
    const text = diffInDays === 0 ? "Today" :
      diffInDays === 1 ? "Tomorrow" :
        diffInDays > 1 ? `${diffInDays} days left` :
          `${Math.abs(diffInDays)} days ago`;

    return (
      <div className={cn(fgColor, "flex items-center gap-x-2 text-xs")}>
        <span className={cn("truncate", className)}>{format(new Date(value), "dd.MM.yyyy")}</span>
        <Badge variant="outline" className={cn(bgColor, fgColor, "truncate border-none", className)}>
          <span className={cn("truncate", className)}>{text}</span>
        </Badge>
      </div>
    );
  }

  return (
    <div className={cn(fgColor, "text-xs")}>
      <span className={cn("truncate", className)}>{format(new Date(value), "dd.MM.yyyy")}</span>
    </div>
  );
};
