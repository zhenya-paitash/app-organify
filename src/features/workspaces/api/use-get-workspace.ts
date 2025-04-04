import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

interface UseGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.workspaces[":workspaceId"].$get({ param: { workspaceId } });
      if (!response.ok) throw new Error("Failed to get workspace");

      const { data } = await response.json();

      return data;
    },
  });
}
