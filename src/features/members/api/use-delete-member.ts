import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.members[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.members[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.v1.members[":memberId"]["$delete"]({ param });
      if (!response.ok) throw new Error("Failed to delete member");
      return await response.json();
    },

    onSuccess: () => {
      toast.success("Member deleted");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  return mutation;
}

