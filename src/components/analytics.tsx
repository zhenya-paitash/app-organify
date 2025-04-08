import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="w-full border-none rounded-lg whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-x-2.5 pb-4">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Total Tasks"
            value={data.task.count}
            increaseValue={data.task.diff}
            variant={data.task.diff > 0 ? "increase" : "decrease"}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Executor Tasks"
            value={data.task.executor.count}
            increaseValue={data.task.executor.diff}
            variant={data.task.executor.diff > 0 ? "increase" : "decrease"}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.task.completed.count}
            increaseValue={data.task.completed.diff}
            variant={data.task.completed.diff > 0 ? "increase" : "decrease"}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.task.overdue.count}
            increaseValue={data.task.overdue.diff}
            variant={data.task.overdue.diff > 0 ? "increase" : "decrease"}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.task.incomplete.count}
            increaseValue={data.task.incomplete.diff}
            variant={data.task.incomplete.diff > 0 ? "increase" : "decrease"}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

