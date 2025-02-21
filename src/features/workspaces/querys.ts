import { cookies } from "next/headers";
import { Account, Client, Databases, Models, Query } from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

export const getWorkspaces = async (): Promise<Models.DocumentList<Models.Document>> => {
  const workspaceEmptyState: Models.DocumentList<Models.Document> = { documents: [], total: 0, }

  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE)?.value;
    if (!session) return workspaceEmptyState;

    client.setSession(session);
    const account = new Account(client);
    const user = await account.get();
    const databases = new Databases(client);

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)])
    if (members.total === 0) return workspaceEmptyState;

    const workspaceIds = members.documents.map(member => member.workspaceId);
    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds)
    ]);

    return workspaces;
  } catch (err: any) {
    console.error(err);
    return workspaceEmptyState;
  }
}
