import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.projects["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.projects["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }): Promise<ResponseType> => {
      const response = await client.api.v1.projects["$post"]({ form });
      if (!response.ok) throw new Error("Failed to create project");
      return await response.json();
    },

    onSuccess: () => {
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },

    onError: () => {
      toast.error("Failed to create project");
    },
  });

  return mutation;
}

