"use client";

import Link from "next/link";

import { Navigation } from "@/components/navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-background/20">
      <Link href="/">LOGO</Link>
      <Navigation />
    </aside>
  );
}

