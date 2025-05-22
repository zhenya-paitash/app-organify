"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { SettingsIcon, UsersIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

type LucideIconType = typeof SettingsIcon;
interface Route {
  label: string;
  href: string;
  icon: IconType | LucideIconType;
  activeIcon: IconType | LucideIconType;
}

const routes: Route[] = [
  { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
  { label: "Tasks", href: "/tasks", icon: GoCheckCircle, activeIcon: GoCheckCircleFill },
  { label: "Members", href: "/members", icon: UsersIcon, activeIcon: UsersIcon }, 
  { label: "Settings", href: "/settings", icon: SettingsIcon, activeIcon: SettingsIcon },
];

export const Navigation = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <ul className="flex flex-col font-heading">
      {routes.map(({ label, href, icon, activeIcon }: Route) => {
        const fullHref = `/workspaces/${workspaceId}${href}`
        const isActive = pathname === fullHref;
        const Icon = isActive ? activeIcon : icon;

        return (
          <Link href={fullHref} key={href}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-foreground/50",
              isActive && "bg-primary/95 text-secondary shadow-sm hover:opacity-100 hover:text-background/95"
            )}>
              <Icon className="size-5 text-neutral-500" />
              {label}
            </div>
          </Link>
        );
      })}
    </ul >
  );
};

