import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ID, Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { TProject } from "@/features/projects/types";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createTaskSchema } from "../schemas";
import { TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";

const app = new Hono()

  .get("/", sessionMiddleware, zValidator("query", z.object({
    workspaceId: z.string(),
    projectId: z.string().nullish(),
    executorId: z.string().nullish(),
    status: z.nativeEnum(TaskStatus).nullish(),
    dueDate: z.string().nullish(),
    search: z.string().nullish(),
  })), async c => {
    const { users } = await createAdminClient();
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId, projectId, executorId, status, dueDate, search } = c.req.valid("query");
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const queryTasks: string[] = [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ];
    if (projectId) queryTasks.push(Query.equal("projectId", projectId));
    if (executorId) queryTasks.push(Query.equal("executorId", executorId));
    if (status) queryTasks.push(Query.equal("status", status));
    if (dueDate) queryTasks.push(Query.equal("dueDate", dueDate));
    if (search) queryTasks.push(Query.search("name", search));
    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, queryTasks);

    const projectIds = tasks.documents.map(task => task.projectId);
    const queryProjects: string[] = projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [];
    const projects = await databases.listDocuments<TProject>(DATABASE_ID, PROJECTS_ID, queryProjects);

    const executorIds = tasks.documents.map(task => task.executorId);
    const queryMembers: string[] = executorIds.length > 0 ? [Query.contains("$id", executorIds)] : [];
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, queryMembers);
    const executors = await Promise.all(members.documents.map(async member => {
      const user = await users.get(member.userId);
      return { ...member, name: user.name, email: user.email };
    }));

    const populatedTasks = tasks.documents.map(task => {
      const project = projects.documents.find(project => project.$id === task.projectId);
      const executor = executors.find(executor => executor.$id === task.executorId);
      return { ...task, project, executor };
    });

    return c.json({ data: { ...tasks, documents: populatedTasks } });
  })

  .post("/", sessionMiddleware, zValidator("json", createTaskSchema), async c => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { name, status, dueDate, workspaceId, projectId, executorId } = c.req.valid("json");
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const highPosTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.equal('status', status),
      Query.orderAsc("position"),
      Query.limit(1),
    ]);
    const newPosTask = highPosTask.documents.length > 0 ? highPosTask.documents[0].position + 1_000 : 1_000;
    const task = await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
      name, status, dueDate, workspaceId, projectId, executorId,
      position: newPosTask,
    });

    return c.json({ data: task });
  })
  ;

export default app;
