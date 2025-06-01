import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ID, Query } from "node-appwrite";

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DateManager } from "@/lib/date-manager";

import { createProjectSchema, updateProjectSchema } from "../schemas";
import { TProject } from "../types";

import { TaskStatus } from "@/features/tasks/types";
import { getMember } from "@/features/members/utils";

const app = new Hono()

  .get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.valid("query");
    if (!workspaceId) return c.json({ error: "Missing workspaceId" }, 400);

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const projects = await databases.listDocuments<TProject>(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: projects });
  })

  .get("/:projectId", sessionMiddleware, async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();
    const project = await databases.getDocument<TProject>(DATABASE_ID, PROJECTS_ID, projectId);
    const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    return c.json({ data: project });
  })

  .get("/:projectId/analytics", sessionMiddleware, async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();
    const project = await databases.getDocument<TProject>(DATABASE_ID, PROJECTS_ID, projectId);
    const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const now = DateManager.create();
    const dateMonth = now.month;

    // all tasks
    const currentMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // only current executor tasks
    const currentMonthExecutorTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("executorId", member.$id),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthExecutorTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("executorId", member.$id),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // incomplete tasks
    const currentMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // completed tasks
    const currentMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", dateMonth.prev.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.prev.end.toISOString()),
    ]);

    // overdue tasks
    const currentMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.value.toISOString()),
      Query.greaterThanEqual("$createdAt", dateMonth.start.toISOString()),
      Query.lessThanEqual("$createdAt", dateMonth.end.toISOString()),
    ]);
    const lastMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
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

  .post("/", sessionMiddleware, zValidator("form", createProjectSchema), async c => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const { name, workspaceId, image } = c.req.valid("form");

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    let uploadedImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      // const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
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

  .patch("/:projectId", sessionMiddleware, zValidator("form", updateProjectSchema), async c => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { projectId } = c.req.param();
    const { name, image } = c.req.valid("form");

    const existingProject = await databases.getDocument<TProject>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: existingProject.workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    let uploadedImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      // const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    } else {
      uploadedImageUrl = image;
    }

    const project = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
      {
        name,
        imageUrl: uploadedImageUrl,
      }
    );

    return c.json({ data: project });
  })

  .delete("/:projectId", sessionMiddleware, async c => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();
    const existingProject = await databases.getDocument<TProject>(DATABASE_ID, PROJECTS_ID, projectId);
    const member = await getMember({ databases, workspaceId: existingProject.workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    // Delete all tasks related to the project
    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [Query.equal("projectId", projectId)]);
    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: existingProject.$id } });
  })
  ;

export default app;
