import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.workspaces[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.workspaces[":workspaceId"]["$delete"]>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.v1.workspaces[":workspaceId"]["$delete"]({ param });
      if (!response.ok) throw new Error("Failed to delete workspace");
      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Workspace delete");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },

    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });

  return mutation;
}

