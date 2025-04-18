import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.v1.projects[":projectId"]["analytics"]["$get"], 200>;

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.v1.projects[":projectId"]["analytics"].$get({ param: { projectId } });
      if (!response.ok) throw new Error("Failed to get project analytics");

      const { data } = await response.json();

      return data;
    },
  });
}
