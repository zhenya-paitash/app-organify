import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.workspaces[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.workspaces[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }): Promise<ResponseType> => {
      const response = await client.api.v1.workspaces[":workspaceId"]["join"]["$post"]({ param, json });
      if (!response.ok) throw new Error("Failed to join workspace");
      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("You joined the workspace");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },

    onError: () => {
      toast.error("Failed to reset join workspace");
    },
  });

  return mutation;
}

