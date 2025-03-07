import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.projects[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.v1.projects[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }): Promise<ResponseType> => {
      const response = await client.api.v1.projects[":projectId"]["$patch"]({ form, param });
      if (!response.ok) throw new Error("Failed to update project");
      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Project updated");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },

    onError: () => {
      toast.error("Failed to update project");
    },
  });

  return mutation;
}

