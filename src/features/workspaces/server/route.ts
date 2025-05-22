import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";
import { DateManager } from "@/lib/date-manager";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";

import { MemberRole } from "@/features/members/types";
import { TaskStatus } from "@/features/tasks/types";
import { TWorkspace } from "../types";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { getMember } from "@/features/members/utils";

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

  .get("/:workspaceId", sessionMiddleware, async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: workspace });
  })

  .get("/:workspaceId/info", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();
    const workspace = await databases.getDocument<TWorkspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      }
    });
  })

  .get("/:workspaceId/analytics", sessionMiddleware, async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const now = DateManager.create();
    const dateMonth = now.month;

    // all tasks
    const currentMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // only current executor tasks
    const currentMonthExecutorTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("executorId", member.$id),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthExecutorTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("executorId", member.$id),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // incomplete tasks
    const currentMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // completed tasks
    const currentMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // overdue tasks
    const currentMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.value.toISOString()),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.value.toISOString()),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    const task = {
      count: currentMonthTasks.total,
      diff: currentMonthTasks.total - lastMonthTasks.total,
      executor: {
        count: currentMonthExecutorTasks.total,
        diff: currentMonthExecutorTasks.total - lastMonthExecutorTasks.total,
      },
      incomplete: {
        count: currentMonthIncompleteTasks.total,
        diff: currentMonthIncompleteTasks.total - lastMonthIncompleteTasks.total,
      },
      completed: {
        count: currentMonthCompletedTasks.total,
        diff: currentMonthCompletedTasks.total - lastMonthCompletedTasks.total,
      },
      overdue: {
        count: currentMonthOverdueTasks.total,
        diff: currentMonthOverdueTasks.total - lastMonthOverdueTasks.total,
      }
    };

    return c.json({ data: { task } });
  })

  .post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async c => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("form");

    let uploadedImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      // const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
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
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      // const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
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
