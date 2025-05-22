import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon, CircleDotDashedIcon, CircleIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";

import { TaskStatus, TaskStatusNames } from "../types";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  count: number;
}

const boardMap: Record<TaskStatus, { icon: React.ReactNode; color: string }> = {
  [TaskStatus.TODO]: {
    icon: <CircleIcon className="size-[18px] text-todo-foreground" />,
    color: "text-todo-foreground"
  },
  [TaskStatus.IN_PROGRESS]: {
    icon: <CircleDotDashedIcon className="size-[18px] text-progress-foreground" />,
    color: "text-progress-foreground"
  },
  [TaskStatus.IN_REVIEW]: {
    icon: <CircleDotIcon className="size-[18px] text-review-foreground" />,
    color: "text-review-foreground"
  },
  [TaskStatus.DONE]: {
    icon: <CircleCheckIcon className="size-[18px] text-done-foreground" />,
    color: "text-done-foreground"
  },
  [TaskStatus.BACKLOG]: {
    icon: <CircleDashedIcon className="size-[18px] text-backlog-foreground" />,
    color: "text-backlog-foreground"
  },
};

export const KanbanColumnHeader = ({ board, count }: KanbanColumnHeaderProps) => {
  const { icon, color } = boardMap[board];
  const { open } = useCreateTaskModal();

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className={`text-sm font-medium ${color}`}>{TaskStatusNames[board]}</h2>
        <div className="flex items-center justify-center size-5 rounded-md text-xs font-medium bg-background/80 text-foreground/80">{count}</div>
      </div>
      <Button className="size-5" onClick={open} variant="ghost" size="icon" ><PlusIcon className="size-4 text-muted-foreground" /></Button>
    </div>
  );
};
