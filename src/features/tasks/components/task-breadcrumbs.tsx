import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Button } from "@/components/ui/button";

import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

import { TProject } from "@/features/projects/types";
import { TTask } from "../types";

interface TaskBreadcrumbsProps {
  task: TTask;
  project: TProject;
}

export const TaskBreadcrumbs = ({ task, project }: TaskBreadcrumbsProps) => {
  const router = useRouter();
  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm({ title: "Delete Task", message: "Are you sure you want to delete this task? This action cannot be undone.", variant: "destructive" });

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { taskId: task.$id } }, {
      onSuccess: () => {
        router.push(`/workspaces/${task.workspaceId}/tasks`);
      },
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8" />
      <Link href={`/workspaces/${task.workspaceId}/projects/${task.projectId}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button className="ml-auto" variant="destructive" size="xs" onClick={handleDeleteTask} disabled={isPending}>
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

