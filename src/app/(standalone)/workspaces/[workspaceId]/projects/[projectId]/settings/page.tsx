import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"
import { getProject } from "@/features/projects/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

interface ProjectByIdSettingsPageProps {
  params: {
    projectId: string;
  }
}

const ProjectByIdSettingsPage = async ({ params }: ProjectByIdSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getProject({ projectId: params.projectId });

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  )
}

export default ProjectByIdSettingsPage
