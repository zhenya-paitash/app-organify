import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, TASKS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";

import { getMember } from "../utils";
import { MemberRole, TMember } from "../types";

const app = new Hono()

  .get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async c => {
    const { users } = await createAdminClient();
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.valid("query")
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const members = await databases.listDocuments<TMember>(DATABASE_ID, MEMBERS_ID, [Query.equal("workspaceId", workspaceId)])
    const membersPopulate = await Promise.all(members.documents.map(async member => {
      const user = await users.get(member.userId);
      return { ...member, name: user.name || user.email, email: user.email };
    }));

    return c.json({ data: { ...members, documents: membersPopulate } });
  })

  .delete("/:memberId", sessionMiddleware, async c => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(DATABASE_ID, MEMBERS_ID, memberId);
    const membersWorkspace = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("workspaceId", memberToDelete.workspaceId)]);
    const member = await getMember({ databases, workspaceId: memberToDelete.workspaceId, userId: user.$id });

    if (!member) return c.json({ error: "Unauthorized" }, 401);
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) return c.json({ error: "Unauthorized" }, 401);

    if (membersWorkspace.total === 1) return c.json({ error: "Cannot delete last member" }, 400);

    const adminsCount = membersWorkspace.documents.filter(m => m.role === MemberRole.ADMIN).length;
    if (memberToDelete.role === MemberRole.ADMIN && adminsCount <= 1) {
      return c.json({ error: "Cannot delete the only admin" }, 400);
    }
    if (member.$id === memberToDelete.$id && member.role === MemberRole.ADMIN) {
      return c.json({ error: "Admin cannot leave the workspace" }, 400);
    }

    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [Query.equal("executorId", memberId)]);
    if (tasks.total > 0) {
      const otherMembers = membersWorkspace.documents.filter(m => m.$id !== memberId);
      if (otherMembers.length > 0) {
        const newExecutorId = otherMembers[0].$id;

        for (const task of tasks.documents) {
          await databases.updateDocument(DATABASE_ID, TASKS_ID, task.$id, { executorId: newExecutorId });
        }
      }
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberId } });
  })

  .patch("/:memberId", sessionMiddleware, zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })), async c => {
    const { memberId } = c.req.param();
    const { role } = c.req.valid("json");
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToUpdate = await databases.getDocument(DATABASE_ID, MEMBERS_ID, memberId);
    const membersWorkspace = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("workspaceId", memberToUpdate.workspaceId)]);
    const member = await getMember({ databases, workspaceId: memberToUpdate.workspaceId, userId: user.$id });

    if (!member) return c.json({ error: "Unauthorized" }, 401);
    if (member.role !== MemberRole.ADMIN) return c.json({ error: "Unauthorized" }, 401);

    if (memberToUpdate.role === MemberRole.ADMIN && role === MemberRole.MEMBER) {
      const adminsCount = membersWorkspace.documents.filter(m => m.role === MemberRole.ADMIN).length;
      if (adminsCount <= 1) {
        return c.json({ error: "Cannot change role of the only admin" }, 400);
      }
    }

    await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, { role });

    return c.json({ data: { $id: memberId } });
  })
  ;

export default app;
