"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { TTask } from "@/features/tasks/types";
import { TProject } from "@/features/projects/types";
import { TMember } from "@/features/members/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Analytics } from "@/components/analytics";

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} count={tasks.total} workspaceId={workspaceId} />
        <ProjectList data={projects.documents} count={projects.total} workspaceId={workspaceId} />
        <MemberList data={members.documents} count={members.total} workspaceId={workspaceId} />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: TTask[];
  count: number;
  workspaceId: string;
}

export const TaskList = ({ data, count, workspaceId }: TaskListProps) => {
  const { open: openCreateTaskModal } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks: {count}</p>
          <Button variant="muted" size="icon" onClick={openCreateTaskModal}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map(task => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-center text-sm text-muted-foreground hidden first-of-type:block">No tasks found.</li>
        </ul>
        <Button className="w-full mt-4" variant="muted" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: TProject[];
  count: number;
  workspaceId: string;
}

export const ProjectList = ({ data, count, workspaceId }: ProjectListProps) => {
  const { open: openCreateProjectModal } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects: {count}</p>
          <Button variant="muted" size="icon" onClick={openCreateProjectModal}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map(project => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectAvatar className="size-12" fallbackClassName="text-lg" name={project.name} image={project.imageUrl} />
                    <p className="text-lg font-medium truncate">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-center text-sm text-muted-foreground hidden first-of-type:block">No projects found.</li>
        </ul>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: TMember[];
  count: number;
  workspaceId: string;
}

export const MemberList = ({ data, count, workspaceId }: MemberListProps) => {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members: {count}</p>
          <Button variant="muted" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(member => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="flex flex-col items-center gap-x-2 p-3">
                  <MemberAvatar className="size-12" name={member.name} />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{member.email}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-center text-sm text-muted-foreground hidden first-of-type:block">No members found.</li>
        </ul>
      </div>
    </div>
  );
};
