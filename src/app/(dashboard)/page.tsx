import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent()
  if (!user) redirect("/login");

  return (
    <div>
      <CreateWorkspaceForm />
    </div>

    // <main className="flex items-center justify-between p-4">
    //   Home page
    // </main>
  );
}
