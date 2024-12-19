import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent()
  if (!user) redirect("/login");

  return (
    <main className="flex items-center justify-between p-4">
      Home page
    </main>
  );
}
