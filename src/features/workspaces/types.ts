import { Models } from "node-appwrite";

export type TWorkspace = Models.Document & {
  name: string;
  imageUrl: string;
  userId: string;
  inviteCode: string;
}
