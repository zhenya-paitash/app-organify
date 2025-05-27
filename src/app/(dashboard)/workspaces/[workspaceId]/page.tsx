import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return (
    <div>Workspace page</div>
  )
}

export default WorkspaceIdPage
