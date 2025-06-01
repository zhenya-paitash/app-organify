"use client";

import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetMembers } from "@/features/members/api/use-get-members";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Analytics } from "@/components/analytics";

import { TaskList } from "./task-list";
import { ProjectList } from "./project-list";
import { MemberList } from "./member-list";

export const WorkspaceByIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspaceAnalytics, isLoading: isLoadingWorkspaceAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
  const isLoading: boolean = [isLoadingWorkspaceAnalytics, isLoadingProjects, isLoadingTasks, isLoadingMembers].some(Boolean);

  if (isLoading) return <PageLoader />;
  if (!workspaceAnalytics || !projects || !tasks || !members) return <PageError message="Failed to load workspace data" />;

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />
      <div className="flex flex-col gap-4">
        <TaskList data={tasks.documents} count={tasks.total} workspaceId={workspaceId} />
        <ProjectList data={projects.documents} count={projects.total} workspaceId={workspaceId} />
        <MemberList data={members.documents} count={members.total} workspaceId={workspaceId} />
      </div>
    </div>
  );
};
