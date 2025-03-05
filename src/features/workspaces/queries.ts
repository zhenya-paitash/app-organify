import { Models, Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { TWorkspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

interface GetWorkspaceBytIdProps {
  workspaceId: string;
}

export const getWorkspaces = async (): Promise<Models.DocumentList<Models.Document>> => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)])
  if (members.total === 0) return { documents: [], total: 0, };

  const workspaceIds = members.documents.map(member => member.workspaceId);
  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds)
  ]);

  return workspaces;
}

export const getWorkspaceById = async ({ workspaceId }: GetWorkspaceBytIdProps): Promise<TWorkspace> => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();
  const member = getMember({
    databases,
    userId: user.$id,
    workspaceId,
  });
  if (!member) { throw new Error("Unauthorized") }

  const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

  return workspace;
}

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps): Promise<{ name: string }> => {
  const { databases } = await createSessionClient();
  const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
  return { name: workspace.name };
}

