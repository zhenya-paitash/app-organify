"use client";

import Link from "next/link";

import { TMember } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

interface MemberListProps {
  data: TMember[];
  count: number;
  workspaceId: string;
  className?: string;
}

export const MemberList = ({
  data,
  count,
  workspaceId,
  className = ""
}: MemberListProps) => {
  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team Members: {count}</h2>
      </div>

      <Separator />

      <ScrollArea className="w-full">
        <div className="flex space-x-6 pb-4">
          {data.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm w-full">No members found</div>
          ) : (
            data.map((member) => (
              <Link key={member.$id} href={`/workspaces/${workspaceId}/members`} className="flex flex-col items-center space-y-2 group">
                <div className="relative p-2">
                  <MemberAvatar className="h-16 w-16 transition-transform group-hover:scale-105" name={member.name} fallbackClassName="text-xl" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{member.name}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
