import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.v0.auth.register["$post"]>;
type RequestType = InferRequestType<typeof client.api.v0.auth.register["$post"]>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({

    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.v0.auth.register["$post"]({ json });
      return await response.json();
    }

  });

  return mutation;
}

