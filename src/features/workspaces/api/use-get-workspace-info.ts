import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

interface UseGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: UseGetWorkspaceInfoProps) => {
  return useQuery({
    queryKey: ["workspace-info", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.workspaces[":workspaceId"]["info"].$get({ param: { workspaceId } });
      if (!response.ok) throw new Error("Failed to get workspace info");

      const { data } = await response.json();

      return data;
    },
  });
}
