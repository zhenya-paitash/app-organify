import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form"
import { redirect } from "next/navigation";

const WorkspaceCreatePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  )
}

export default WorkspaceCreatePage
