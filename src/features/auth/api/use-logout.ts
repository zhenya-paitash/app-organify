import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v1.auth.logout["$post"]>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (): Promise<ResponseType> => {
      const response = await client.api.v1.auth.logout["$post"]();
      if (!response.ok) throw new Error("Failed to logout");
      return await response.json();
    },

    onSuccess: () => {
      toast.success("Logged out!");
      router.refresh();
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return mutation;
}

