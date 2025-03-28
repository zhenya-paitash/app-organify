"use client";

import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";

interface TaskDateProps {
  value: string;
  className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
  const [today, endDate] = [new Date(), new Date(value)];
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  if (diffInDays <= 2) { textColor = "text-red-500" }
  else if (diffInDays <= 5) { textColor = "text-amber-500" }
  else if (diffInDays <= 7) { textColor = "text-orange-500" }
  else if (diffInDays <= 14) { textColor = "text-yellow-500" }
  ;

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(value, "dd / MM / yyyy")}</span>
    </div>
  );
};
