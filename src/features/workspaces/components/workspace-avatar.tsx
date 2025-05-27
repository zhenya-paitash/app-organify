import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorkspaceAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

export const WorkspaceAvatar = ({ name, image, className }: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div className={cn(
        "size-10 relative rounded-md overflow-hidden",
        className,
      )}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className="text-primary bg-secondary font-semibold text-lg uppercase rounded-md">{name[0]}</AvatarFallback>
    </Avatar>
  );
}
