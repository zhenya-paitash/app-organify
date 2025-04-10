"use client";

import Link from "next/link";

import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { Navigation } from "@/components/navigation";
import { Projects } from "@/components/projects";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-background/20 flex flex-col gap-y-8">
      <Link href="/"><span>APP ORGANIFY</span></Link>
      <WorkspaceSwitcher />
      <Navigation />
      <Projects />
    </aside>
  );
}

