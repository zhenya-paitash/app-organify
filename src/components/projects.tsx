"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosAdd } from "react-icons/io";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

export const Projects = () => {
  const pathname = usePathname();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  const { open } = useCreateProjectModal();

  const handleEdit = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/projects/${projectId}/settings`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xs uppercase text-foreground/50">Projects</p>
        <IoIosAdd onClick={open} className="size-5 text-foreground/50 cursor-pointer hover:opacity-75 transition" data-cursor-scale={0.5} data-cursor-stick data-cursor-blend="exclusion" />
      </div>
      {data?.documents.map(project => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id} data-cursor-color="var(--gradient)" data-cursor-scale={2}>
            <div className={cn(
              "group flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:opacity-75 transition cursor-pointer text-foreground/75 relative",
              isActive && "bg-background shadow-sm hover:opacity-100 text-primary"
            )}>
              <ProjectAvatar className="rounded-full" image={project.imageUrl} name={project.name} />
              <span className="truncate font-normal">{project.name}</span>
              <button
                onClick={(e) => handleEdit(e, project.$id)}
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                data-cursor-scale={0.5}
              >
                <Settings2 className="size-4 text-foreground/50 hover:text-foreground/75 transition-colors" />
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
