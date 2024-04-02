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
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const router = useNavigate();

  const formSchema = z
    .object({
      username: z.string().min(4, {
        message: "Username must be at least 4 characters.",
      }),
      email: z.string().email({
        message: "Email is not in valid form",
      }),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          }
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { username, email, password } = values;
    try {
      await axios.post("http://localhost:5500/api/register", {
        username,
        email,
        password,
      });
      router("/Account/Login")
    } catch (err:any) {
      if (err.response && err.response.status === 400) {
        form.setError("username", { message: "That username is taken. Try another" });
      } else {
        console.error("An error occurred:", err);
      }
    }
  }
  return (
    <div
      className={`flex justify-center h-screen md:h-5/6 bg-background w-screen md:w-11/12 lg:w-3/4  rounded px-6`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 flex flex-col w-full m-auto md:w-1/2 justify-between"
        >
          <h1 className={`text-4xl font-bold`}>Weclome To Chatly</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                    className={`rounded bg-softBlue text-white hover:bg-softBlue text-lg py-6`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className={`flex gap-1 items-center text-base`}>
            You already have an account?
            <Link
              to="/Account/Login"
              className={`underline text-lg font-semibold`}
            >
              Login
            </Link>
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
        <img
          src={`/signup_ilustration.svg`}
          alt="login ilustration"
          className=" w-80"
        />
      </div>
    </div>
  );
}
