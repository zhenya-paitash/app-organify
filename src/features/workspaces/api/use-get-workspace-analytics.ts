import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type WorkspaceAnalyticsResponseType = InferResponseType<typeof client.api.v1.workspaces[":workspaceId"]["analytics"]["$get"], 200>;

export const useGetWorkspaceAnalytics = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.workspaces[":workspaceId"]["analytics"].$get({ param: { workspaceId } });
      if (!response.ok) throw new Error("Failed to get workspace analytics");

      const { data } = await response.json();

      return data;
    },
  });
}
