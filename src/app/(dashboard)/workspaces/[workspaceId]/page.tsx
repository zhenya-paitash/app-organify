import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceByIdClient } from "./client";

const WorkspaceByIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <WorkspaceByIdClient />
};

export default WorkspaceByIdPage;
