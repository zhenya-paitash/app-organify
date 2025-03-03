import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemeberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({ name, className, fallbackClassName }: MemeberAvatarProps) => {
  return (
    <Avatar className={cn("size-5 rounded-full transition border border-foreground/10", className)}>
      <AvatarFallback className={cn("flex items-center justify-center font-medium bg-foreground/10 text-background/80", fallbackClassName)}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
