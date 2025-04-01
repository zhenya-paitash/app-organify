import { useRouter } from "next/navigation";

import { TProject } from "@/features/projects/types"
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

import { TaskStatus } from "../types";

// TODO: fix `any` types
interface EventCardProps {
  id: string
  title: string
  project: TProject | any;
  executor: any;
  status: TaskStatus;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-violet-300",
  [TaskStatus.TODO]: "border-l-red-300",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-300",
  [TaskStatus.IN_REVIEW]: "border-l-blue-300",
  [TaskStatus.DONE]: "border-l-emerald-300",
}

export const EventCard = ({ id, title, project, executor, status }: EventCardProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div className={cn(
        "flex flex-col gap-y-1.5 p-1.5 text-xs bg-primary/5 text-primary border border-l-4 rounded-md cursor-pointer hover:opacity-75 transition",
        statusColorMap[status],
      )} onClick={handleOnClick}>
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={executor?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.imageUrl} />
        </div>
      </div>
    </div>
  );
};

