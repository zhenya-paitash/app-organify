import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ID, Query } from "node-appwrite";

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "@/features/members/utils";
import { createProjectSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.valid("query");
    if (!workspaceId) return c.json({ error: "Missing workspaceId" }, 400);

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: projects });
  })
  .post("/", sessionMiddleware, zValidator("form", createProjectSchema), async c => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const { name, workspaceId, image } = c.req.valid("form");

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

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

    const project = await databases.createDocument(
      DATABASE_ID,
      PROJECTS_ID,
      ID.unique(),
      {
        name,
        imageUrl: uploadedImageUrl,
        workspaceId,
      }
    );

    return c.json({ data: project });
  })
  ;

export default app;
