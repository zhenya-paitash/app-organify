import { ThemeButton } from "@/components/theme-button";
import { UserButton } from "@/features/auth/components/user-button";

import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent()
  console.log(user);
  if (!user) redirect("/login");

  return (
    <main className="flex items-center justify-between p-4">
      <ThemeButton />
      <UserButton />
    </main>
  );
}
