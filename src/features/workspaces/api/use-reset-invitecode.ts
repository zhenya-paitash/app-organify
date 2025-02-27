import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.workspaces[":workspaceId"]["reset-invitecode"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.workspaces[":workspaceId"]["reset-invitecode"]["$post"]>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.v1.workspaces[":workspaceId"]["reset-invitecode"]["$post"]({ param });
      if (!response.ok) throw new Error("Failed to reset invite code");

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Failed to reset invite code");
    },
  });

  return mutation;
}

