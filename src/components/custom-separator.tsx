import { cn } from "@/lib/utils";

interface CustomSeparatorProps {
  className?: string;
  color?: string;
  height?: string;
  dot?: string;
  gap?: string;
  direction?: "horizontal" | "vertical";
}

export const CustomSeparator = ({
  className,
  color = "#d4d4d8",
  height = "4px",
  dot = "4px",
  gap = "12px",
  direction = "horizontal",
}: CustomSeparatorProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div className={cn(className, "flex", "items-center", isHorizontal ? "w-full" : "h-full flex-col")}>
      <div className={isHorizontal ? "flex-grow" : "flex-grow-0"} style={{
        width: isHorizontal ? "100%" : height,
        height: isHorizontal ? height : "100%",
        backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
        backgroundSize: isHorizontal ? `${parseInt(dot) + parseInt(gap)}px ${height}` : `${height} ${parseInt(dot) + parseInt(gap)}px`,
        backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        backgroundPosition: "center",
      }} />
    </div>
  );
}
