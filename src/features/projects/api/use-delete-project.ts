import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.projects[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.projects[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.v1.projects[":projectId"]["$delete"]({ param });
      if (!response.ok) throw new Error("Failed to delete project");
      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },

    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  return mutation;
}

