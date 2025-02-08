import { UserButton } from "@/features/auth/components/user-button";
import { ThemeButton } from "@/components/theme-button";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">Monitor all of your projects and tasks</p>
      </div>

      <MobileSidebar />

      <div className="flex gap-4">
        <ThemeButton />
        <UserButton />
      </div>
    </nav>
  );
}
