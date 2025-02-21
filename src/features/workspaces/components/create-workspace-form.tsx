"use client";

import { z } from "zod";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
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

import { createWorkspaceSchema } from "../schemas";
import { useCreateWorkspace } from "../api/use-create-workspace";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    }
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const updValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    }

    mutate({ form: updValues }, {
      onSuccess: ({ data }) => {
        form.reset();
        router.push(`/workspaces/${data.$id}`);
      }
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  }

  return (
    <Card className="w-full h-full border-none shadow-none bg-background">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">New Workspace</CardTitle>
      </CardHeader>

      {/* <div className="p-7"> */}
      <Separator />
      {/* </div> */}

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
                          <Button
                            type="button"
                            variant="upload"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                          >Upload image</Button>
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
                <Button type="submit" variant="primary" size="lg" disabled={isPending}>Create Workspace</Button>
              </div>

            </form>
          </Form>
        </div>

      </CardContent>
    </Card>
  );
};
