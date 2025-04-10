"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";
import { ThemeButton } from "@/components/theme-button";
import { MobileSidebar } from "./mobile-sidebar";

interface RouteConfig {
  title: string;
  description: string;
}

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  default: { title: "Home", description: "Monitor all of your projects and tasks" },
  tasks: { title: "Tasks", description: "View all of your tasks" },
  projects: { title: "Projects", description: "View tasks of your project" },
} as const;

const getRouteConfig = (path: string): RouteConfig => {
  const segments = path.split("/").filter(Boolean);
  for (const segment of segments.reverse()) if (segment in ROUTE_CONFIG) return ROUTE_CONFIG[segment];
  return ROUTE_CONFIG.default;
};


export const Navbar = () => {
  const pathname = usePathname();
  const { title, description } = getRouteConfig(pathname);

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex gap-4">
        <ThemeButton />
        <UserButton />
      </div>
    </nav>
  );
}
