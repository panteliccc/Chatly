"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../Components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../Components/ui/form";
import { Input } from "../Components/ui/input";

export function Login() {
  const formSchema = z.object({
    email: z.string().email({
      message: "Email is not in valid form",
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div
      className={`flex justify-center h-3/4 bg-background w-screen md:w-11/12 lg:w-3/4  rounded px-6`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col w-full m-auto md:w-1/2 justify-between"
        >
          <h1 className={`text-5xl font-bold`}>Weclome Back</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    {...field}
                    className={`rounded bg-softBlue text-white hover:bg-softBlue text-lg py-6`}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    {...field}
                    className={`rounded bg-softBlue text-white hover:bg-softBlue text-lg py-6`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className={`flex gap-1 items-center`}>
            Do not have an account?
            <a href="/" className={`underline`}>
              Register
            </a>
          </span>
          <Button
            type="submit"
            className={`rounded bg-softBlue text-white hover:bg-softBlue text-lg p-6`}
          >
            Submit
          </Button>
        </form>
      </Form>
      <div className="invisible w-0 overflow-hidden md:w-1/2 md:visible flex justify-center items-center">
        <img src={`/login_ilustration.svg`} alt="login ilustration" className=" w-96"/>
      </div>
    </div>
  );
}
