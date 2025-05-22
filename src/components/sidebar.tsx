"use client";

import Link from "next/link";

import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { Navigation } from "@/components/navigation";
import { Projects } from "@/components/projects";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full flex flex-col gap-y-8 p-4">
      <Link href="/"><span className="font-heading text-xl text-primary">app organify</span></Link>
      <WorkspaceSwitcher />
      <Navigation />
      <Projects />
    </aside>
  );
}

