import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type TMember = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
}

