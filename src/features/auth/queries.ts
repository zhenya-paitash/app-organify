import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
  try {
    const { account } = await createSessionClient();
    return account.get();
  } catch {
    return null;
  }
}
