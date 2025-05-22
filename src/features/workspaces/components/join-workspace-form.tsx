"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invitecode";
import { useWorkspaceId } from "../hooks/use-workspace-id";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  }
}

export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate({
      param: { workspaceId },
      json: { inviteCode },
    }, {
      onSuccess: ({ data }) => {
        router.push(`/workspaces/${data.$id}`);
      },
    });
  };

  return (
    <Card className="w-full h-full border-none shadown-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription className="">
          You&apos;ve been invited to join a <strong>{initialValues.name}</strong> workspace
        </CardDescription>
      </CardHeader>

      <div className="px-7"><Separator /></div>

      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <Button type="button" variant="ghost" size="lg" className="w-full lg:w-fit" disabled={isPending} asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="button" size="lg" className="w-full lg:w-fit" onClick={onSubmit} disabled={isPending}>
            Join to workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
