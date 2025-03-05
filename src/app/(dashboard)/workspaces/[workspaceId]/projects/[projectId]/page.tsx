import Link from "next/link";
import { redirect } from "next/navigation";
import { LuPencil } from "react-icons/lu"

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Button } from "@/components/ui/button";

import { getCurrent } from "@/features/auth/queries"
import { getProject } from "@/features/projects/queries";

interface ProjectByIdPageProps {
  params: {
    projectId: string;
  }
}

const ProjectByIdPage = async ({ params }: ProjectByIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getProject({ projectId: params.projectId });
  if (!initialValues) { throw new Error("Project not found") }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <ProjectAvatar name={initialValues.name} image={initialValues.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
              <LuPencil className="size-4 mr-2" />Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div >
  )
}

export default ProjectByIdPage
