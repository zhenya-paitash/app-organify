"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { TProject } from "@/features/projects/types";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  data: TProject[];
  count: number;
  workspaceId: string;
  className?: string;
}

export const ProjectList = ({ 
  data, 
  count, 
  workspaceId, 
  className = "" 
}: ProjectListProps) => {
  const { open: openCreateProjectModal } = useCreateProjectModal();

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects: {count}</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openCreateProjectModal}
          className="text-muted-foreground hover:text-foreground"
        >
          <PlusIcon className="size-4" />
          <span className="sr-only">Create project</span>
        </Button>
      </div>

      <Separator />

      <ScrollArea className="w-full">
        <div className="flex space-x-6 pb-4">
          {data.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm w-full">
              No projects found
            </div>
          ) : (
            data.map((project) => (
              <Link 
                key={project.$id} 
                href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                className="flex flex-col items-center space-y-2 group"
              >
                <div className="relative p-2">
                  <ProjectAvatar 
                    className="h-16 w-16 rounded-lg transition-transform group-hover:scale-105" 
                    name={project.name} 
                    image={project.imageUrl}
                    fallbackClassName="text-2xl"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {project.name}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}; 
