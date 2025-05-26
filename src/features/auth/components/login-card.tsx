"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SeparatorWithText } from "@/components/separator-with-text";

import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const LoginCard = () => {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    mutate({ json: data });
  }

  return (
    <Card className="border-none shadow-none bg-inherit w-full max-w-[420px]">
      <CardHeader className="flex items-center justify-center text-center p-4">
        <CardTitle className="text-3xl p-4 font-bold">Welcome back</CardTitle>
        <CardDescription className="text-gray-600 pb-4">Please enter your login details below to using the app.</CardDescription>
      </CardHeader>

      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter email address" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button className="w-full" size="lg" disabled={isPending}>Sign In</Button>
          </form>
        </Form>
      </CardContent>

      <SeparatorWithText text="Or login with" />

      <CardContent className="grid grid-cols-1 gap-2 p-7 sm:grid-cols-2">
        <Button className="w-full" variant="secondary" size="sm" onClick={() => signUpWithGoogle()} disabled={isPending}><FcGoogle className="size-5" />Sign in with Google</Button>
        <Button className="w-full" variant="secondary" size="sm" onClick={() => signUpWithGithub()} disabled={isPending}><FaGithub className="size-5" />Sign in with GitHub</Button>
      </CardContent>

      <CardContent className="flex justify-center items-center text-center p-7">
        <p>Don&apos;t have an account?&nbsp;<Link href="/register" data-cursor-scale={0.5}><span className="link">Create an account</span></Link></p>
      </CardContent>
    </Card>
  );
};
