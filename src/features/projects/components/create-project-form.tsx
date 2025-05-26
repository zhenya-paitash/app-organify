"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

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
import { ImageUpload } from '@/components/ui/image-upload';

import { createProjectSchema } from "../schemas";
import { useCreateProject } from "../api/use-create-project";

interface CreateProjectFormProps {
  onCancel?: () => void;
};

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    }
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const updValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
    }

    mutate({ form: updValues }, {
      onSuccess: ({ data }) => {
        form.reset();
        router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
      }
    });
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new Project</CardTitle>
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
                <Button type="submit" variant="primary" size="lg" disabled={isPending}>Create Project</Button>
              </div>

            </form>
          </Form>
        </div>

      </CardContent>
    </Card>
  );
};
