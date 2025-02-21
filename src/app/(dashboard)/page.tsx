import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/querys";
import { getWorkspaces } from "@/features/workspaces/querys";

export default async function Home() {
  const user = await getCurrent()
  if (!user) redirect("/login");

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
