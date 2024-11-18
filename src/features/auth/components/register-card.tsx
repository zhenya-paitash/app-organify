import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { CustomSeparator } from "@/components/custom-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/terms"><span className="text-blue-400">terms</span></Link>
          {" and "}
          <Link href="/policy"><span className="text-blue-400">policy</span></Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7 mb-2"><CustomSeparator /></div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button className="w-full" size="lg" disabled={false}>Register</Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7 mb-2"><CustomSeparator /></div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button className="w-full" variant="secondary" size="lg" disabled={false}><FcGoogle className="mr-2 size-5" />Login with Goggle</Button>
        <Button className="w-full" variant="secondary" size="lg" disabled={false}><FaGithub className="mr-2 size-5" />Login with GitHub</Button>
      </CardContent>

      <div className="px-7"><CustomSeparator /></div>

      <CardContent className="flex justify-center items-center p-7">
        <p>Already have an account?<Link href="/login"><span className="text-blue-400">&nbsp;Log In</span></Link></p>
      </CardContent>
    </Card>
  );
};
