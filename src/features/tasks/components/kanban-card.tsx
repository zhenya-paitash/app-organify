import { MoreHorizontalIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";

import { TTask } from "../types";

interface KanbanCardProps {
  task: TTask;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-background/90 p-2.5 mb-2.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId} workspaceId={task.workspaceId}>
          <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-foreground/80 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <Separator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.executor.name} fallbackClassName="text-[10px]" />
        <div className="size-1 rounded-full bg-foreground/10" />
        <TaskDate className="text-xs" value={task.dueDate} variant="PPP" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackClassName="text-[10px]" />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};
