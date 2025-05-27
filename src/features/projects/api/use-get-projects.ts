import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.v1.projects.$get({ query: { workspaceId } });
      if (!response.ok) throw new Error("Failed to get projects");

      const { data } = await response.json();

      return data;
    },
  });
}
