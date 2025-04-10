import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon, CircleDotDashedIcon, CircleIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";

import { TaskStatus, TaskStatusNames } from "../types";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  count: number;
}

const icons: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-[18px] text-violet-300" />,
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-300" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className="size-[18px] text-yellow-300" />,
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className="size-[18px] text-blue-300" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-[18px] text-emerald-300" />,
};

export const KanbanColumnHeader = ({ board, count }: KanbanColumnHeaderProps) => {
  const icon = icons[board];
  const { open } = useCreateTaskModal();

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{TaskStatusNames[board]}</h2>
        <div className="flex items-center justify-center size-5 rounded-md bg-background/80 text-xs text-foreground/80 font-medium">{count}</div>
      </div>
      <Button
        className="size-5"
        onClick={open}
        variant="ghost"
        size="icon"
      ><PlusIcon className="size-4 text-muted-foreground" /></Button>
    </div>
  );
};
