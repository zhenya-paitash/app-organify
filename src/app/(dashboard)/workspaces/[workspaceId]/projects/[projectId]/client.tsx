"use client";

import Link from "next/link";
import { LuPencil } from "react-icons/lu"

import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics";

export const ProjectByIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: projectAnalytics, isLoading: isLoadingProjectAnalytics } = useGetProjectAnalytics({ projectId });
  const isLoading = [isLoadingProject, isLoadingProjectAnalytics].some(Boolean);

  if (isLoading) return <PageLoader />
  if (!project) return <PageError message="Project not found" />

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <ProjectAvatar name={project.name} image={project.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
              <LuPencil className="size-4 mr-2" />Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {projectAnalytics ? <Analytics data={projectAnalytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div >
  )
};
