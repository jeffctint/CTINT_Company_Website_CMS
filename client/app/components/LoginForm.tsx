"use client";

import Link from "next/link";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/components/ui/form";
import { Input } from "@app/components/ui/loginInput";
import { useToast } from "@app/components/ui/use-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(4, { message: "Password required" }),
  })
  .required();

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.required()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.url) {
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res?.error,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-1/2 space-y-16"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a9b3c6]">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="text-white bg-transparent border-b-[1px] !outline-none placeholder:bg-transparent"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a9b3c6]">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="text-white bg-transparent border-b-[1px] !outline-none"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#97f64d] text-[#181f25] hover:bg-[#97f64d]"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
