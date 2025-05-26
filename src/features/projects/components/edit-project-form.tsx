"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

import { TProject } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { updateProjectSchema } from "../schemas";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { ImageUpload } from '@/components/ui/image-upload';

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: TProject;
};

export const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm({ title: "Delete project", message: "Are you sure you want to delete this project?", variant: "destructive" });

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    }
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const updValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    }

    mutate({ form: updValues, param: { projectId: initialValues.$id } });
  }

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteProject(
      { param: { projectId: initialValues.$id } },
      { onSuccess: () => { window.location.href = `/workspaces/${initialValues.workspaceId}` } },
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
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
                      <FormLabel>Project Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                          label="Project Icon"
                        />
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

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your project, there is no going back. Please be
              certain.
            </p>
            <Separator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="xs"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
            >Delete Project</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
