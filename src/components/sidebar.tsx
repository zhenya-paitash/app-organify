"use client";

import Link from "next/link";

import { Navigation } from "@/components/navigation";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-background/20">
      <Link href="/">LOGO</Link>
      <WorkspaceSwitcher />
      <Navigation />
    </aside>
  );
}

