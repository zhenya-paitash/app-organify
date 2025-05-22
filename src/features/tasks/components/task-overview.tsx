import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Badge } from "@/components/ui/badge";
import { TaskOverviewProperty } from "./task-overview-property";
import { TaskDate } from "./task-date";

import { useEditTaskModal } from "../hooks/use-edit-task-modal";

import { TaskStatusNames, TTask } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface TaskOverviewProps {
  task: TTask;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button size="sm" variant="secondary" onClick={() => open(task.$id)}>
            <PencilIcon className="size-4 mr-2" />Edit
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <TaskOverviewProperty label="Executor">
            <MemberAvatar name={task.executor.name} className="size-6" />
            <p className="text-sm font-medium">{task.executor.name}</p>
          </TaskOverviewProperty>
          <TaskOverviewProperty label="Project">
            <ProjectAvatar name={task.project.name} image={task.project.imageUrl} className="size-6" />
            <p className="text-sm font-medium">{task.project.name}</p>
          </TaskOverviewProperty>
          <TaskOverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} variant="full" className="text-sm font-medium" />
          </TaskOverviewProperty>
          <TaskOverviewProperty label="Status">
            <Badge variant={task.status}>{TaskStatusNames[task.status]}</Badge>
          </TaskOverviewProperty>
        </div>
      </div>
    </div>
  );
};
