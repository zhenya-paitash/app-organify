import { createSessionClient } from "@/lib/appwrite";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { TProject } from "./types";

import { getMember } from "../members/utils";

interface GetProjcetProps {
  projectId: string;
}

export const getProject = async ({ projectId }: GetProjcetProps): Promise<TProject> => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();
  const project = await databases.getDocument<TProject>(DATABASE_ID, PROJECTS_ID, projectId);
  const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });
  if (!member) throw new Error("Unauthorized");

  return project;
};
