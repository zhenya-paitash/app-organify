"use client";

import { useEffect, useState } from "react";
import { MoreVertical, ShieldCheck, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { MemberRole } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useDeleteMember } from "@/features/members/api/use-delete-member";

import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { Skeleton } from "@/components/ui/skeleton";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();

  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    // This code will only run on the client side
    setInviteLink(`${window.location.origin}/workspaces/${workspaceId}/join`);
  }, [workspaceId]);

  const handleCopyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard!"));
  };

  const [DeleteMemberDialog, confirmDeleteMember] = useConfirm({
    title: "Remove member",
    message: "Are you sure you want to remove this member?",
    variant: "destructive"
  });

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDeleteMember();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      { onSuccess: () => window.location.reload() },
    );
  };

  const getRoleBadge = (role: MemberRole) => {
    const isAdmin = role === MemberRole.ADMIN;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAdmin ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
        }`}>
        {isAdmin && <ShieldCheck className="mr-1 h-3 w-3" />}
        {isAdmin ? 'Admin' : 'Member'}
      </span>
    );
  };

  return (
    <Card className="border-none shadow-sm">
      <DeleteMemberDialog />
      <CardHeader className="flex flex-row items-center justify-between p-7">
        <div>
          <CardTitle className="text-xl font-bold">Members List</CardTitle>
          <CardDescription>Manage your workspace members and their permissions</CardDescription>
        </div>
        <Button
          size="xs"
          variant="secondary"
          className="gap-2"
          onClick={handleCopyInviteLink}
        >
          <CopyIcon className="h-4 w-4" />Invite
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))
          ) : (
            data?.documents.map((member) => (
              <div key={member.$id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <MemberAvatar
                    className="h-10 w-10"
                    name={member.name}
                    fallbackClassName="text-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(member.role as MemberRole)}
                      <p className="font-medium">{member.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                        disabled={isUpdatingMember || member.role === MemberRole.ADMIN}
                      >
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                        disabled={isUpdatingMember || member.role === MemberRole.MEMBER}
                      >
                        Make Member
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteMember(member.$id)}
                      disabled={isDeletingMember}
                    >
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
