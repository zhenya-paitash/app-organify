"use client";

import { FolderIcon, ListCheckIcon, UserIcon, X } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";

import { DatePicker } from "@/components/date-picker";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectSeparator, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

  const projectOptions = projects?.documents?.map(project => ({ value: project.$id, label: project.name })) || [];
  const memberOptions = members?.documents?.map(member => ({ value: member.$id, label: member.name })) || [];

  const [{ projectId, executorId, status, dueDate }, setFilters] = useTaskFilters();

  const onStatusChange = (value: string) => setFilters({ status: value === "*" ? null : value as TaskStatus });
  const onExecutorChange = (value: string) => setFilters({ executorId: value === "*" ? null : value as string });
  const onProjectChange = (value: string) => setFilters({ projectId: value === "*" ? null : value as string });

  const hasActiveFilters = status || executorId || projectId || dueDate;
  const clearFilters = () => setFilters({ status: null, executorId: null, projectId: null, dueDate: null });

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 text-body">
      {/* Clear All Button - Only show when filters are active */}
      {hasActiveFilters && (
        <div className="w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground text-sm font-normal"
          >
            <X className="size-3.5 mr-1.5" />
            Clear
          </Button>
        </div>
      )}

      {/* Status Filter */}
      <div className="w-full sm:w-[180px]">
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <Select value={status ?? "*"} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full h-8">
              <div className="flex items-center">
                <ListCheckIcon className="size-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                <SelectValue placeholder="Status" className="text-sm" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Status</SelectItem>
              <SelectSeparator />
              <SelectItem value={TaskStatus.TODO} className="flex items-center text-todo-foreground">
                {TaskStatusNames[TaskStatus.TODO]}
              </SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS} className="flex items-center text-progress-foreground">
                {TaskStatusNames[TaskStatus.IN_PROGRESS]}
              </SelectItem>
              <SelectItem value={TaskStatus.IN_REVIEW} className="flex items-center text-review-foreground">
                {TaskStatusNames[TaskStatus.IN_REVIEW]}
              </SelectItem>
              <SelectItem value={TaskStatus.DONE} className="flex items-center text-done-foreground">
                {TaskStatusNames[TaskStatus.DONE]}
              </SelectItem>
              <SelectItem value={TaskStatus.BACKLOG} className="flex items-center text-backlog-foreground">
                {TaskStatusNames[TaskStatus.BACKLOG]}
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Executor Filter */}
      <div className="w-full sm:w-[180px]">
        {isLoadingMembers ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <Select value={executorId ?? "*"} onValueChange={onExecutorChange}>
            <SelectTrigger className="w-full h-8">
              <div className="flex items-center">
                <UserIcon className="size-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                <SelectValue placeholder="Assignee" className="text-sm" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Assignees</SelectItem>
              {memberOptions.length > 0 && <SelectSeparator />}
              {memberOptions.map(member => (
                <SelectItem key={member.value} value={member.value}>
                  <div className="flex items-center">{member.label}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Project Filter - Only show if not hidden */}
      {!hideProjectFilter && (
        <div className="w-full sm:w-[180px]">
          {isLoadingProjects ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Select value={projectId ?? "*"} onValueChange={onProjectChange}>
              <SelectTrigger className="w-full h-8">
                <div className="flex items-center">
                  <FolderIcon className="size-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="Project" className="text-sm" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*">All Projects</SelectItem>
                {projectOptions.length > 0 && <SelectSeparator />}
                {projectOptions.map(project => (
                  <SelectItem key={project.value} value={project.value}>
                    <div className="flex items-center">
                      <span className="truncate">{project.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Due Date Filter */}
      <div className="w-full sm:w-[180px]">
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <DatePicker
            value={dueDate ? new Date(dueDate) : undefined}
            onChange={(date: Date | undefined) => {
              setFilters({ dueDate: date ? date.toISOString() : null });
            }}
            placeholder="Due date"
            className="h-8 text-sm"
          />
        )}
      </div>
    </div>
  );
};
