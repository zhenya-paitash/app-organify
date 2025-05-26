"use client";

import Link from "next/link";

import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { Navigation } from "@/components/navigation";
import { Projects } from "@/components/projects";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full flex flex-col gap-y-8 p-4">
      <Link href="/"><span className="font-heading text-xl text-primary">app organify</span></Link>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-y-8 p-1">
          <WorkspaceSwitcher />
          <Navigation />
          <Projects />
        </div>
      </ScrollArea>
    </aside>
  );
}

