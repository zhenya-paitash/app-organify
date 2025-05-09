"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosAdd } from "react-icons/io";
import { cn } from "@/lib/utils";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  const { open } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text.xs uppercase text-foreground/50">Projects</p>
        <IoIosAdd onClick={open} className="size-5 text-foreground/50 cursor-pointer hover:opacity-75 transition" />
      </div>
      {data?.documents.map(project => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:opacity-75 transition cursor-pointer text-foreground/75",
              isActive && "bg-background shadow-sm hover:opacity-100 text-primary"
            )}>
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
