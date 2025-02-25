import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspaceById } from "@/features/workspaces/queries";

interface WorkspaceByIdSettingsPageProps {
  params: {
    workspaceId: string;
  }
}

const WorkspaceByIdSettingsPage = async ({ params }: WorkspaceByIdSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getWorkspaceById({ workspaceId: params.workspaceId });
  if (!initialValues) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className="w-full lg:max-w-xl"><EditWorkspaceForm initialValues={initialValues} /></div>
  )
}

export default WorkspaceByIdSettingsPage
