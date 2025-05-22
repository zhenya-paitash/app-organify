import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"

import { WorkspaceByIdSettingsClient } from "./client";

const WorkspaceByIdSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <WorkspaceByIdSettingsClient />
}

export default WorkspaceByIdSettingsPage
