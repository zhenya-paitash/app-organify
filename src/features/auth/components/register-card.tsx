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
import { SeparatorWithText } from "@/components/separator-with-text";

const formSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().email(),
  password: z.string().min(8, { message: "Minimum of 8 characters required" }),
});

export const RegisterCard = () => {
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
        <CardTitle className="text-3xl p-4 font-bold">Join to <span className="bg-primary p-1 px-4 rounded-md text-background">Organify</span></CardTitle>
        <CardDescription className="text-gray-600 pb-4">
          By signing up, you agree to our{" "}
          <Link href="/terms"><span className="text-blue-500">terms</span></Link>
          {" and "}
          <Link href="/policy"><span className="text-blue-500">policy</span></Link>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

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
                  <Input {...field} type="password" placeholder="Enter password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button className="w-full" size="lg" disabled={false}>Create account</Button>
          </form>
        </Form>
      </CardContent>

      <SeparatorWithText text="Or register with" />

      <CardContent className="grid grid-cols-1 gap-2 p-7 sm:grid-cols-2">
        <Button className="w-full" variant="secondary" size="sm" disabled={false}><FcGoogle className="size-5" />Google</Button>
        <Button className="w-full" variant="secondary" size="sm" disabled={false}><FaGithub className="size-5" />GitHub</Button>
      </CardContent>

      <CardContent className="flex justify-center items-center text-center p-7">
        <p>Already have an account?&nbsp;<Link href="/login"><span className="text-blue-500">Log In</span></Link></p>
      </CardContent>
    </Card>
  );
};
