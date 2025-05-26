import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  increaseValue: number;
  variant: "increase" | "decrease";
}

const iconColorMap: Record<AnalyticsCardProps["variant"], string> = {
  increase: "text-done",
  decrease: "text-todo",
};

export const AnalyticsCard = ({ title, value, increaseValue, variant }: AnalyticsCardProps) => {
  const iconColor = iconColorMap[variant];
  const increaseValueColor = iconColorMap[variant];
  const Icon = variant === "increase" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="w-full shadow-none border-none" data-cursor-stick data-cursor-scale={0.5}>
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn(iconColor, "size-4")} />
            <span className={cn(increaseValueColor, "truncate text-base font-medium")}>{increaseValue}</span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

