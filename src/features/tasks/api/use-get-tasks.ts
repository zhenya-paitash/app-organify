import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

interface UseGetTasksProps {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.tasks.$get({ query: { workspaceId } });
      if (!response.ok) throw new Error("Failed to get tasks");

      const { data } = await response.json();

      return data;
    },
  });
}
