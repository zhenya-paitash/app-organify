"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { TaskStatusNames, TTask } from "@/features/tasks/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "@/features/tasks/components/task-date";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TaskListProps {
  data: TTask[];
  count: number;
  workspaceId: string;
  className?: string;
}

export const TaskList = ({ data, count, workspaceId, className }: TaskListProps) => {
  const { open: openCreateTaskModal } = useCreateTaskModal();
  const sorted = [...data].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const displayTasks = sorted.slice(0, 10);
  const hasTasks = sorted.length > 0;
  const hasMore = sorted.length > 10;

  return (
    <Card className={cn("flex flex-col flex-1 min-w-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between px-6 pb-2 pt-4">
        <CardTitle className="text-base font-medium">
          Tasks: {count}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full hover:bg-muted-foreground/10"
          onClick={openCreateTaskModal}
        >
          <PlusIcon className="size-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 px-6 pb-4">
            {!hasTasks ? (
              <div className="py-8 text-center text-muted-foreground text-sm w-full">No tasks</div>
            ) : (
              displayTasks.map((task) => (
                <div key={task.$id} className="w-64 flex-shrink-0 rounded-lg border p-4 hover:shadow-md transition-shadow" data-cursor-scale="0.5">
                  <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`} className="block h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={task.status} className="text-xs">
                          {TaskStatusNames[task.status]}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="-mr-1">
                                <MemberAvatar className="size-6 rounded-full border-2 border-background" name={task.executor?.name} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">{task.executor?.name || "Unassigned"}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <h3 className="font-medium mb-2 line-clamp-2">{task.name}</h3>
                      <div className="mt-auto pt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <ProjectAvatar className="size-4 rounded-full" name={task.project?.name} image={task.project?.imageUrl} />
                          <span className="truncate">{task.project?.name || 'No project'}</span>
                        </div>
                        <div className="text-xs">
                          <TaskDate value={task.dueDate} variant="diffInDays" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {hasMore && (
        <div className="flex justify-center px-6 pb-4">
          <Button variant="ghost" className="w-full max-w-md" asChild>
            <Link href={`/workspaces/${workspaceId}/tasks`}>
              View all ({count})
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}; 
