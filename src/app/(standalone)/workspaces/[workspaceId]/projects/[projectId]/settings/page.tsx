import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"

import { ProjectByIdSettingsClient } from "./client";

const ProjectByIdSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <ProjectByIdSettingsClient />;
}

export default ProjectByIdSettingsPage;
