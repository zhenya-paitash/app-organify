import { Calendar1Icon, MoreHorizontalIcon } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";

import { TaskStatus, TTask } from "../types";

interface KanbanCardProps {
  task: TTask;
}

const colorByStatus: Record<TaskStatus, { background: string, foreground: string }> = {
  [TaskStatus.BACKLOG]: { background: "bg-backlog/25 dark:bg-backlog/10", foreground: "text-backlog-foreground" },
  [TaskStatus.TODO]: { background: "bg-todo/25 dark:bg-todo/10", foreground: "text-todo-foreground" },
  [TaskStatus.IN_PROGRESS]: { background: "bg-progress/25 dark:bg-progress/10", foreground: "text-progress-foreground" },
  [TaskStatus.IN_REVIEW]: { background: "bg-review/25 dark:bg-review/10", foreground: "text-review-foreground" },
  [TaskStatus.DONE]: { background: "bg-done/25 dark:bg-done/10", foreground: "text-done-foreground" },
};

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const { background, foreground } = colorByStatus[task.status];

  return (
    <div className="bg-background rounded-lg shadow-sm space-y-5 mb-2.5" data-cursor-scale={0.5}>
      <div className={`${background} p-2.5 rounded-[inherit] space-y-5`}>
        <div className="flex items-start justify-between gap-x-2">
          <div className={`${foreground} text-backlog-foreground flex gap-x-2`}>
            <Calendar1Icon className="size-5" />
            <TaskDate className="text-xs" value={task.dueDate} variant="diffInDays" />
          </div>
          <TaskActions id={task.$id} projectId={task.projectId} workspaceId={task.workspaceId}>
            <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-foreground/80 hover:opacity-75 transition" />
          </TaskActions>
        </div>
        <div className={`${foreground} flex flex-col gap-1.5 py-1`}>
          <p className="text-sm line-clamp-2">{task.name}</p>
          <span className="text-muted-foreground text-xs line-clamp-4">{task.description}</span>
        </div>
        <div className="flex gap-x-2 justify-between">
          <div className="flex items-center gap-x-1.5 text-xs font-medium">
            <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackClassName="text-[10px]" className="rounded-full" />
            <span className="line-clamp-1 text-muted-foreground">{task.project.name}</span>
          </div>
          <div className="flex items-center gap-x-1.5 text-xs font-medium group relative">
            <MemberAvatar name={task.executor.name} fallbackClassName="text-[10px]" />
            <span className="opacity-0 group-hover:opacity-100 absolute right-6 transition-all duration-200 text-xs font-medium text-muted-foreground bg-background/90 px-2 py-1 rounded shadow-sm">{task.executor.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
