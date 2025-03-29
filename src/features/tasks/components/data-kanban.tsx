import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { KanbanColumnHeader } from "./kanban-column-header";

import { TTask, TaskStatus, TaskStatusNames } from "../types";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: TTask[];
}

interface DataKnabanProps {
  data: TTask[];
}

export const DataKnaban = ({ data }: DataKnabanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    for (const task of data) initialTasks[task.status].push(task);

    for (const board of Object.keys(initialTasks)) initialTasks[board as TaskStatus].sort((a, b) => a.position - b.position);

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => { }}>
      <div className="flex overflow-x-auto">
        {boards.map(board => (
          <div className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]" key={board}>
            <KanbanColumnHeader board={board} count={tasks[board].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

