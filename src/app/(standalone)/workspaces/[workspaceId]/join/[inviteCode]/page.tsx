import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface WorkspaceByIdJoinPageProps {
  params: {
    workspaceId: string;
  }
}


const WorkspaceByIdJoinPage = async ({ params }: WorkspaceByIdJoinPageProps) => {
  const user = getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getWorkspaceInfo({ workspaceId: params.workspaceId });
  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}

export default WorkspaceByIdJoinPage
