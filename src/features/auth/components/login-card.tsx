import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, { message: "Required" }),
});

export const LoginCard = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  }

  return (
    <Card className="border-none shadow-none bg-inherit w-full max-w-[420px]">
      <CardHeader className="flex items-center justify-center text-center p-4">
        <CardTitle className="text-3xl p-4 font-bold">Welcome back</CardTitle>
        <CardDescription className="text-gray-600 mb-8">Please enter your login details below to using the app.</CardDescription>
      </CardHeader>

      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter email address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button className="w-full" size="lg" disabled={false}>Sign In</Button>
          </form>
        </Form>
      </CardContent>

      <Separator />

      <CardContent className="grid grid-cols-1 gap-2 p-7 sm:grid-cols-2">
        <Button className="w-full" variant="secondary" size="sm" disabled={false}><FcGoogle className="size-5" />Sign in with Google</Button>
        <Button className="w-full" variant="secondary" size="sm" disabled={false}><FaGithub className="size-5" />Sign in with GitHub</Button>
      </CardContent>

      <CardContent className="flex justify-center items-center text-center p-7">
        <p>Don&apos;t have an account?&nbsp;<Link href="/register"><span className="text-blue-500">Create an account</span></Link></p>
      </CardContent>
    </Card>
  );
};
