import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

import { TTask, TaskPayload, TaskStatus } from "../types";

type TaskState = {
  [key in TaskStatus]: TTask[];
}

interface DataKnabanProps {
  data: TTask[];
  onChange: (task: TaskPayload[]) => void;
}

export const DataKnaban = ({ data, onChange }: DataKnabanProps) => {
  // const initialState: TaskState = {
  //   [TaskStatus.BACKLOG]: [],
  //   [TaskStatus.TODO]: [],
  //   [TaskStatus.IN_PROGRESS]: [],
  //   [TaskStatus.IN_REVIEW]: [],
  //   [TaskStatus.DONE]: [],
  // };
  const initialState = useMemo(() => ({
    [TaskStatus.BACKLOG]: [],
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.IN_REVIEW]: [],
    [TaskStatus.DONE]: [],
  }), []);

  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = JSON.parse(JSON.stringify(initialState));
    for (const task of data) initialTasks[task.status].push(task);
    for (const board of Object.keys(initialTasks)) initialTasks[board as TaskStatus].sort((a, b) => a.position - b.position);
    return initialTasks;
  });

  useEffect(() => {
    const updatedTasks: TaskState = JSON.parse(JSON.stringify(initialState));
    for (const task of data) updatedTasks[task.status].push(task);
    for (const board of Object.keys(updatedTasks)) updatedTasks[board as TaskStatus].sort((a, b) => a.position - b.position);
    setTasks(updatedTasks);
  }, [data, initialState]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceBoard = source.droppableId as TaskStatus;
    const destinationBoard = destination.droppableId as TaskStatus;
    let updatePayload: { $id: string; status: TaskStatus; position: number; }[] = [];

    setTasks(prev => {
      const newTasks = { ...prev };

      // remove task from source board column
      const sourceColumn: TTask[] = [...newTasks[sourceBoard]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // if no moverd task then return previous state
      if (!movedTask) {
        console.error("No task found to move from source index");
        return prev;
      }

      // create a new task object with updated properties
      const updatedTask = sourceBoard !== destinationBoard ? { ...movedTask, status: destinationBoard } : movedTask;

      // update task position on destination board column
      newTasks[sourceBoard] = sourceColumn;

      // add task to destination board column
      const destinationColumn: TTask[] = [...newTasks[destinationBoard]];
      destinationColumn.splice(destination.index, 0, updatedTask);
      newTasks[destinationBoard] = destinationColumn;

      // Prepare minimize update payload
      updatePayload = [];
      updatePayload.push({  // always update the dragged task
        $id: updatedTask.$id,
        status: destinationBoard,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      // update position for affected tasks in the destination board column
      newTasks[destinationBoard].forEach((task, idx) => {
        if (task && task.$id !== updatedTask.$id) {
          const newPosition = Math.min((idx + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) updatePayload.push({ $id: task.$id, status: destinationBoard, position: newPosition });
        }
      });

      // if the task moved between boards columns, update position for affected tasks in the source board column
      if (sourceBoard !== destinationBoard) newTasks[sourceBoard].forEach((task, idx) => {
        if (!task) return;
        const newPosition = Math.min((idx + 1) * 1000, 1_000_000);
        if (task.position !== newPosition) updatePayload.push({ $id: task.$id, status: sourceBoard, position: newPosition });
      });

      return newTasks;
    });

    onChange(updatePayload);
  }, [onChange]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {Object.values(TaskStatus).map(board => (
          <div className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]" key={board}>
            <KanbanColumnHeader board={board} count={tasks[board].length} />
            <Droppable droppableId={board}>
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px] py-1.5">
                  {tasks[board].map((task, idx) => (
                    <Draggable key={task.$id} draggableId={task.$id} index={idx}>
                      {provided => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

