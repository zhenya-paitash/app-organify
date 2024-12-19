import Link from "next/link";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { SettingsIcon, UsersIcon } from "lucide-react";
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
  { label: "My Tasks", href: "/tasks", icon: GoCheckCircle, activeIcon: GoCheckCircleFill },
  { label: "Settings", href: "/settings", icon: SettingsIcon, activeIcon: SettingsIcon },
  { label: "Members", href: "/members", icon: UsersIcon, activeIcon: UsersIcon },
];

export const Navigation = () => {
  return (
    <ul className="flex flex-col ">
      {routes.map(({ label, href, icon, activeIcon }: Route) => {
        const isActive = false;
        const Icon = isActive ? activeIcon : icon;

        return (
          <Link href={href} key={href}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
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

