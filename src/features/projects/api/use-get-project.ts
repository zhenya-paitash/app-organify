import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc";

interface UseGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.v1.projects[":projectId"].$get({ param: { projectId } });
      if (!response.ok) throw new Error("Failed to get project");

      const { data } = await response.json();

      return data;
    },
  });
}
