import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

import { TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  executorId?: string | null;
  dueDate?: string | null;
}

export const useGetTasks = ({ workspaceId, projectId, status, search, executorId, dueDate }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId, projectId, status, search, executorId, dueDate],
    queryFn: async () => {
      const response = await client.api.v1.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          executorId: executorId ?? undefined,
          dueDate: dueDate ?? undefined,
        }
      });
      if (!response.ok) throw new Error("Failed to get tasks");

      const { data } = await response.json();

      return data;
    },
  });
}
