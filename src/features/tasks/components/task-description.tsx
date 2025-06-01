import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { TTask } from "../types";
import { useUpdateTask } from "../api/use-update-task";

interface TaskDescriptionProps {
  task: TTask;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({
      json: { description },
      param: { taskId: task.$id },
    }, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button size="xs" variant="secondary" onClick={() => setIsEditing(prev => !prev)}>
          {isEditing ? <XIcon className="size-4 mr-2" /> : <PencilIcon className="size-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <Separator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={description}
            rows={4}
            onChange={e => setDescription(e.target.value)}
            disabled={isPending}
            className="bg-primary/10"
          ></Textarea>
          <Button size="sm" className="w-fit ml-auto" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>{task.description || <p className="text-muted-foreground">No description</p>}</div>
      )}
    </div>
  );
};
