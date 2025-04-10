"use client";

import { z } from "zod";
import { useMemo, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invitecode";
import { updateWorkspaceSchema } from "../schemas";
import { TWorkspace } from "../types";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: TWorkspace;
};

export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm({ title: "Delete workspace", message: "Are you sure you want to delete this workspace?", variant: "destructive" });
  const [ResetInviteDialog, confirmResetInviteDialog] = useConfirm({ title: "Reset invite code", message: "Are yo sure? This invalidates all existing invite codes", variant: "destructive" });

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    }
  });

  // useEffect(() => {
  //   form.reset({ ...initialValues, image: initialValues.imageUrl ?? "" });
  // }, [form, initialValues]);

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const updValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    }

    mutate({ form: updValues, param: { workspaceId: initialValues.$id } });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  }

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      { onSuccess: () => { window.location.href = "/" } },
    );
  }

  const handleResetInvite = async () => {
    const ok = await confirmResetInviteDialog();
    if (!ok) return;

    resetInviteCode({ param: { workspaceId: initialValues.$id } });
  }

  // const inviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const inviteLink = useMemo(() => { return `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}` }, [initialValues.$id, initialValues.inviteCode]);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard!"));
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetInviteDialog />
      <Card className="w-full h-full border-none shadow-none bg-background">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
            <ArrowLeftIcon className="size-4 mr-2" />Back
          </Button>
          <CardTitle className="text-xl font-bold">{initialValues.name}</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="py-4">
                      <FormLabel>Workspace Image</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                className="object-cover"
                                src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                alt="Logo"
                                fill
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex flex-col">
                            <p className="text-sm">Workspace Icon</p>
                            <p className="text-sm text-muted-foreground">
                              SVG, PNG, JPG or JPEG (max. 1MB).
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .png, .jpeg, .svg"
                              ref={inputRef}
                              onChange={handleImageChange}
                              disabled={isPending}
                            />
                            {field.value ?
                              (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="xs"
                                  className="w-fit mt-2"
                                  onClick={() => {
                                    field.onChange(null);
                                    if (inputRef.current) {
                                      inputRef.current.value = "";
                                    }
                                  }}
                                  disabled={isPending}
                                >Remove image</Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="upload"
                                  size="xs"
                                  className="w-fit mt-2"
                                  onClick={() => inputRef.current?.click()}
                                  disabled={isPending}
                                >Upload image</Button>
                              )
                            }
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="py-7" />

                <div className="flex items-cdenter justify-between">
                  <Button type="button" variant="secondary" size="lg" onClick={onCancel} disabled={isPending} className={cn(!onCancel && "invisible")}>Cancel</Button>
                  <Button type="submit" variant="primary" size="lg" disabled={isPending}>Save changes</Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none bg-background">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Invite others to join your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input value={inviteLink} disabled />
                <Button type="button" variant="secondary" size="xs" className="size-12" onClick={handleCopyInviteLink}><CopyIcon className="size-5" /></Button>
              </div>
            </div>
            <Separator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="xs"
              variant="secondary"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInvite}
            >Reset invite link</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none bg-background">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your workspace, there is no going back. Please be
              certain.
            </p>
            <Separator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="xs"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >Delete Workspace</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
