import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";

import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { TWorkspace } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async c => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)])
    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map(member => member.workspaceId);
    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds)
    ]);

    return c.json({ data: workspaces });
  })
  .post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async c => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("form");

    let uploadedImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id,
      );

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
        inviteCode: generateInviteCode(),
      }
    );

    await databases.createDocument(
      DATABASE_ID,
      MEMBERS_ID,
      ID.unique(),
      {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      }
    );

    return c.json({ data: workspace });
  })
  .patch("/:workspaceId", sessionMiddleware, zValidator("form", updateWorkspaceSchema), async c => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { workspaceId } = c.req.param();
    const { name, image } = c.req.valid("form");

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member || member.role !== MemberRole.ADMIN) return c.json({ error: "Unauthorized" }, 401);

    let uploadedImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id,
      );

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    } else {
      uploadedImageUrl = image;
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        name,
        imageUrl: uploadedImageUrl,
      }
    );

    return c.json({ data: workspace });
  })
  .delete("/:workspaceId", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member || member.role !== MemberRole.ADMIN) return c.json({ error: "Unauthorized" }, 401);

    // TODO: DEL members
    // TODO: DEL projects
    // TODO: DEL tasks
    // DELETE workspace
    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invitecode", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member || member.role !== MemberRole.ADMIN) return c.json({ error: "Unauthorized" }, 401);

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      inviteCode: generateInviteCode(),
    });

    return c.json({ data: workspace });
  })
  .post("/:workspaceId/join", sessionMiddleware, zValidator("json", z.object({ inviteCode: z.string() })), async c => {
    const { workspaceId } = c.req.param();
    const { inviteCode } = c.req.valid("json");

    const databases = c.get("databases");
    const user = c.get("user");
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (member) return c.json({ error: "Already joined" }, 400);

    const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
    if (workspace.inviteCode !== inviteCode) return c.json({ error: "Invalid invite code" }, 400);

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      userId: user.$id,
      workspaceId,
      role: MemberRole.MEMBER,
    });

    return c.json({ data: workspace });
  })
  ;

export default app;
