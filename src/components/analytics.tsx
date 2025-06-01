import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";

import { AnalyticsCard } from "./analytics-card";

type AnalyticsCardVariant = "increase" | "decrease";

interface AnalyticsProps {
  data: (ProjectAnalyticsResponseType | WorkspaceAnalyticsResponseType)['data'];
  className?: string;
}

const getVariant = (value: number, invert = false): AnalyticsCardVariant => {
  const isIncrease = value >= 0;
  return (invert ? !isIncrease : isIncrease) ? 'increase' : 'decrease';
};

export const Analytics = ({ data, className }: AnalyticsProps) => {
  const cards = [
    {
      title: "Total Tasks",
      value: data.task.count,
      increaseValue: Math.abs(data.task.diff),
      variant: getVariant(data.task.diff),
    },
    {
      title: "Executor Tasks",
      value: data.task.executor.count,
      increaseValue: Math.abs(data.task.executor.diff),
      variant: getVariant(data.task.executor.diff),
    },
    {
      title: "Completed Tasks",
      value: data.task.completed.count,
      increaseValue: Math.abs(data.task.completed.diff),
      variant: getVariant(data.task.completed.diff),
    },
    {
      title: "Overdue Tasks",
      value: data.task.overdue.count,
      increaseValue: Math.abs(data.task.overdue.diff),
      variant: getVariant(data.task.overdue.diff, true), // Invert variant for overdue
    },
    {
      title: "Incomplete Tasks",
      value: data.task.incomplete.count,
      increaseValue: Math.abs(data.task.incomplete.diff),
      variant: getVariant(data.task.incomplete.diff, true), // Invert variant for incomplete
    },
  ] as const;

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, index) => (
          <AnalyticsCard
            key={index}
            title={card.title}
            value={card.value}
            increaseValue={card.increaseValue}
            variant={card.variant}
          />
        ))}
      </div>
    </div>
  );
};
