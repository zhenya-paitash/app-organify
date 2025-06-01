import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type VariantType = "increase" | "decrease";

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  increaseValue: number;
  variant: VariantType;
  className?: string;
}

interface ChartPoint {
  value: number;
  timestamp: number;
}

const generateChartData = (currentValue: number, variant: VariantType): ChartPoint[] => {
  const POINTS_COUNT = 6;
  const MIN_VISIBLE_VALUE = 0; // Minimum value to show on chart
  const BASE_VARIANCE = 0.1; // 10% variance for natural look

  const endValue = Math.max(MIN_VISIBLE_VALUE, currentValue); // Ensure we have a valid number and handle zero case
  const startValue = variant === "increase" ? endValue * 0.3 : endValue * 1.5; // Calculate start value based on variant

  // Generate smooth curve with proper trend
  return Array.from({ length: POINTS_COUNT }, (_, i) => {
    const progress = i / (POINTS_COUNT - 1);

    // Cubic easing function for smoother animation
    const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Add natural-looking variance
    const variance = (Math.random() * 2 - 1) * endValue * BASE_VARIANCE;

    // Calculate value with easing and variance
    const value = startValue + (endValue - startValue) * easeInOutCubic(progress) + variance;

    return { value: Math.max(MIN_VISIBLE_VALUE, value), timestamp: i };
  });
}

export const AnalyticsCard = ({ title, value, increaseValue, variant, className }: AnalyticsCardProps) => {
  const isIncrease = variant === "increase";
  const numericValue = typeof value === 'number' ? value : parseInt(String(value)) || 0;
  const chartData = generateChartData(numericValue, variant);
  const changeColor = isIncrease ? "text-done-foreground" : "text-todo-foreground";
  const strokeColor = isIncrease ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(0, 84.2%, 60.2%)"

  return (
    <Card className={cn("overflow-hidden", className)} data-cursor-scale={3} data-cursor-blend="exclusion" data-cursor-stick>
      <CardHeader className="pb-2">
        <CardDescription className="text-sm font-heading">{title}</CardDescription>
        <CardTitle className="text-2xl">
          {value}
          <span className={cn("ml-2 text-xs font-body", changeColor)}>({isIncrease && '+'}{increaseValue})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[80px] px-6 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`color${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={strokeColor} fillOpacity={1} fill={`url(#color${title.replace(/\s+/g, '')})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

