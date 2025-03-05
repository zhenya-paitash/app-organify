import { Models } from "node-appwrite";

export type TProject = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
}
