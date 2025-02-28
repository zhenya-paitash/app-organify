import { Models, Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { TWorkspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

interface GetWorkspaceBytIdProps {
  workspaceId: string;
}

export const getWorkspaces = async (): Promise<Models.DocumentList<Models.Document>> => {
  const workspaceEmptyState: Models.DocumentList<Models.Document> = { documents: [], total: 0, }

  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();
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

export const getWorkspaceById = async ({ workspaceId }: GetWorkspaceBytIdProps): Promise<TWorkspace | null> => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();
    const member = getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member) return null;

    const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return workspace;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

interface GetWorkspaceInfoProps {
  workspaceId: string;
}


export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps): Promise<{ name: string } | null> => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return { name: workspace.name };
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

