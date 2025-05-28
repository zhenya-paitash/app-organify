"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { TiPlus } from "react-icons/ti";
import { Loader } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataFilters } from "./data-filters";
import { DataTable } from "./data-table";
import { DataKnaban } from "./data-kanban";
import { DataCalendar } from "./data-calendar";
import { columns } from "./columns";

import { TaskPayload } from "../types";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const [{ projectId, executorId, status, dueDate }] = useTaskFilters();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId ?? projectId,
    status,
    executorId,
    dueDate,
  });
  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();
  const { open } = useCreateTaskModal();


  const onKanbanChange = useCallback((tasks: TaskPayload[]) => {
    bulkUpdateTasks({ json: { tasks } });
  }, [bulkUpdateTasks]);

  return (
    <Tabs className="w-full flex-1 border rounded-lg" defaultValue={view} onValueChange={setView}>
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <TabsList className="w-full lg:w-auto font-heading">
            <TabsTrigger className="w-full min-w-32 h-8 lg:w-auto" value="table" data-cursor-stick data-cursor-scale={0.5}>Table</TabsTrigger>
            <TabsTrigger className="w-full min-w-32 h-8 lg:w-auto" value="kanban" data-cursor-stick data-cursor-scale={0.5}>Kanban</TabsTrigger>
            <TabsTrigger className="w-full min-w-32 h-8 lg:w-auto" value="calendar" data-cursor-stick data-cursor-scale={0.5}>Calendar</TabsTrigger>
          </TabsList>
          <Button onClick={open} className="w-full lg:w-auto" size="xs"><TiPlus className="size-4 mr-2" />Add Task</Button>
        </div>

        {/* <Separator className="my-4" /> */}
        <div className="bg-muted/60 rounded-lg my-4 pt-4">
          <h3 className="w-full text-center">Data Filters</h3>
          <DataFilters hideProjectFilter={hideProjectFilter} />
        </div>

        {isLoadingTasks ? (
          <div className="w-full h=[200px] flex flex-col items-center justify-center border rounded-lg">
            <Loader className="animate-spin size-5 text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable data={tasks?.documents ?? []} columns={columns} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKnaban data={tasks?.documents ?? []} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
