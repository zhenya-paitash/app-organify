import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  name: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({ name, image, className, fallbackClassName }: ProjectAvatarProps) => {
  if (image) {
    return (
      <div className={cn(
        "size-5 relative rounded-sm overflow-hidden",
        className,
      )}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 rounded-sm", className)}>
      <AvatarFallback className={cn("text-primary bg-secondary font-semibold text-xs uppercase rounded-sm", fallbackClassName)}>{name[0]}</AvatarFallback>
    </Avatar>
  );
}
