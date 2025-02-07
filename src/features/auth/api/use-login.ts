import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v0.auth.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.v0.auth.login["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.v0.auth.login["$post"]({ json });
      if (!response.ok) throw new Error("Failed to login");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in!")
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to login")
    }
  });

  return mutation;
}

