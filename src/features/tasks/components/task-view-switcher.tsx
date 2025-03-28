"use client";

import { useQueryState } from "nuqs";
import { TiPlus } from "react-icons/ti";
import { Loader } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { DataFilters } from "./data-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";

export const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });

  const workspaceId = useWorkspaceId();
  const [{ projectId, executorId, status, dueDate }] = useTaskFilters();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId, projectId, status, executorId, dueDate });
  const { open } = useCreateTaskModal();

  return (
    <Tabs className="w-full flex-1 border rounded-lg" defaultValue={view} onValueChange={setView}>
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="w-full h-8 lg:w-auto" value="table">Table</TabsTrigger>
            <TabsTrigger className="w-full h-8 lg:w-auto" value="kanban">Kanban</TabsTrigger>
            <TabsTrigger className="w-full h-8 lg:w-auto" value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <Button onClick={open} className="w-full lg:w-auto" size="xs"><TiPlus className="size-4 mr-2" />New</Button>
        </div>
        <Separator className="my-4" />
        <h3 className="w-full text-center">Data Filters</h3>
        <Separator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full h=[200px] flex flex-col items-center justify-center border rounded-lg">
            <Loader className="animate-spin size-5 text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataFilters />
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataFilters />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataFilters />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
