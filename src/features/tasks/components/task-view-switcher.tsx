"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { LayoutGrid, List, Calendar, Loader, Plus } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={open} className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <div className="flex items-center justify-between flex-wrap">
          <TabsList>
            <TabsTrigger value="table" className="gap-2" data-cursor-stick data-cursor-scale={0.5}>
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-2" data-cursor-stick data-cursor-scale={0.5}>
              <LayoutGrid className="h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2" data-cursor-stick data-cursor-scale={0.5}>
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
          <DataFilters hideProjectFilter={hideProjectFilter} />
        </div>

        {isLoadingTasks ? (
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <DataTable data={tasks?.documents ?? []} columns={columns} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="kanban" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <DataKnaban data={tasks?.documents ?? []} onChange={onKanbanChange} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <DataCalendar data={tasks?.documents ?? []} />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
