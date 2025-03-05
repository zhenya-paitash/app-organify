"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import { MemberRole } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useDeleteMember } from "@/features/members/api/use-delete-member";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const [DeleteMemberDialog, confirmDeleteMember] = useConfirm({ title: "Delete member", message: "Are you sure you want to delete this member?", variant: "destructive" });

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

  return (
    <Card className="w-full h-wull border-none shadow-none">
      <DeleteMemberDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7 ">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}><ArrowLeftIcon className="size-4 mr-2" />Back</Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>

      <div className="px-7"><Separator /></div>

      <CardContent className="p-7">
        {isLoading ? <p>wait a moment...</p> : data?.documents.map((member, idx) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar className="size-10" name={member.name} fallbackClassName="text-lg" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="ghost" size="icon"><MoreVerticalIcon className="size-4 text-muted-foreground" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem className="font-medium" onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={isUpdatingMember}>Set as Administrator</DropdownMenuItem>
                  <DropdownMenuItem className="font-medium" onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={isUpdatingMember}>Set as Member</DropdownMenuItem>
                  <DropdownMenuItem className="font-medium text-destructive/90" onClick={() => handleDeleteMember(member.$id)} disabled={isDeletingMember}>Remove {member.name}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {idx < data.documents.length - 1 && <Separator className="my-2" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
