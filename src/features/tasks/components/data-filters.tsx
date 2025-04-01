"use client";

import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";

import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

import { TaskStatus, TaskStatusNames } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
  const isLoading = [isLoadingProjects, isLoadingMembers].some(Boolean);

  const projectOptions = projects?.documents.map(project => ({ value: project.$id, label: project.name }));
  const memberOptions = members?.documents.map(member => ({ value: member.$id, label: member.name }));

  const [{ projectId, executorId, status, dueDate }, setFilters] = useTaskFilters();

  const onStatusChange = (value: string) => setFilters({ status: value === "*" ? null : value as TaskStatus });
  const onExecutorChange = (value: string) => setFilters({ executorId: value === "*" ? null : value as string });
  const onProjectChange = (value: string) => setFilters({ projectId: value === "*" ? null : value as string });

  if (isLoading) return null;
  return (
    <div className="flex flex-col lg:flex-row gap-2 p-4">
      {/* filter by: STATUS  */}
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">All Status</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>{TaskStatusNames[TaskStatus.BACKLOG]}</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>{TaskStatusNames[TaskStatus.IN_REVIEW]}</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>{TaskStatusNames[TaskStatus.IN_PROGRESS]}</SelectItem>
          <SelectItem value={TaskStatus.DONE}>{TaskStatusNames[TaskStatus.DONE]}</SelectItem>
          <SelectItem value={TaskStatus.TODO}>{TaskStatusNames[TaskStatus.TODO]}</SelectItem>
        </SelectContent>
      </Select>

      {/* filter by: EXECUTOR ID  */}
      <Select defaultValue={executorId ?? undefined} onValueChange={onExecutorChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Executors" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">All Executors</SelectItem>
          <SelectSeparator />
          {memberOptions?.map(member => <SelectItem key={member.value} value={member.value}>{member.label}</SelectItem>)}
        </SelectContent>
      </Select>

      {/* filter by: PROJECT ID  */}
      {!hideProjectFilter && (
        <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*">All Projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map(project => <SelectItem key={project.value} value={project.value}>{project.label}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      {/* filter by: DUE DATE  */}
      <DatePicker
        className="w-full lg:w-auto h-8"
        placeholder="Due Date"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={date => setFilters({ dueDate: date ? date.toISOString() : null })}
      />
    </div>
  );
};
