"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Separator } from "@/components/ui/separator";

import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

export const TaskByIdClient = () => {
  const taskId = useTaskId();
  const { data: task, isLoading } = useGetTask({ taskId });

  if (isLoading) return <PageLoader />;
  if (!task) return <PageError message="Task not found" />

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs task={task} project={task.project} />
      <Separator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
};
