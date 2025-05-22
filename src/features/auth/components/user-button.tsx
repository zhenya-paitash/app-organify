"use client";

import { Loader, LogOut } from "lucide-react";
import { useCurrent } from "../api/use-current";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useLogout } from "../api/use-logout";

export const UserButton = () => {
  const { data: userData, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userData) return null;

  const { name, email } = userData;
  const avatarFallback: string = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-8 hover:opacity-75 transition">
          <AvatarFallback className="flex items-center justify-center font-medium">{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full min-w-80 border-2" align="end" side="bottom" sideOffset={10}>
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex gap-x-4">
            <Avatar className="size-12">
              <AvatarFallback className="flex items-center justify-center font-medium text-xl">{avatarFallback}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-foreground/75 truncate max-w-48">{name || "User"}</p>
              <p className="text-xs text-foreground/50 truncate max-w-48">{email}</p>
            </div>
          </div>

          <DropdownMenuItem className="flex items-center justify-center h-12 font-heading cursor-pointer text-foreground/75" onClick={() => logout()}>
            <LogOut className="size-4 mr-1" />Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
