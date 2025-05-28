import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceByIdJoinClient } from "./client";

const WorkspaceByIdJoinPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <WorkspaceByIdJoinClient />
};

export default WorkspaceByIdJoinPage;
