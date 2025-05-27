import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

interface UseGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.v1.tasks[":taskId"].$get({ param: { taskId } });
      if (!response.ok) throw new Error("Failed to get task");

      const { data } = await response.json();

      return data;
    },
  });
}
