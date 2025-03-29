import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useDeleteTask } from "../api/use-delete-task";

interface TaskActionsProps {
  id: string;
  projectId: string;
  workspaceId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, workspaceId, children }: TaskActionsProps) => {
  const router = useRouter();
  const { open } = useEditTaskModal();
  const [ConfirmDialog, confirm] = useConfirm({ title: "Delete Task", message: "Are you sure you want to delete this task?", variant: "destructive" });
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();

  const handleOpenTask = () => router.push(`/workspaces/${workspaceId}/tasks/${id}`);

  const handleOpenProject = () => router.push(`/workspaces/${workspaceId}/projects/${projectId}`);

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteTask({ param: { taskId: id } });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="font-medium p-[10px]" onClick={handleOpenTask}>
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px]" onClick={handleOpenProject}>
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px]" onClick={() => open(id)}>
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive font-medium p-[10px]" onClick={handleDeleteTask} disabled={isDeletingTask}>
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
