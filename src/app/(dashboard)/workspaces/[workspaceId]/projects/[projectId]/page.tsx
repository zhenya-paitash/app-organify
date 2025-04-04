import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"

import { ProjectByIdClient } from "./client";

const ProjectByIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <ProjectByIdClient />
};

export default ProjectByIdPage;
