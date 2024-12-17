import { cookies } from "next/headers";
import { Account, Client, Models } from "node-appwrite";

import { AUTH_COOKIE } from "./constants";

export const getCurrent = async (): Promise<Models.User<Models.Preferences> | null> => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE)?.value;
    if (!session) return null;

    client.setSession(session);
    const account = new Account(client);

    return await account.get();
  } catch (err: any) {
    console.error(err);
    return null;
  }
}
