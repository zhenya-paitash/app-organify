import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  DELAY = "DELAY",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
};

// export const TaskStatusNames: Record<TaskStatus, string> = {
export const TaskStatusNames = {
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.DELAY]: "Delayed",
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Completed",
} as const;

export type TTask = Models.Document & {
  name: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  executorId: string;
  position: number;
}
