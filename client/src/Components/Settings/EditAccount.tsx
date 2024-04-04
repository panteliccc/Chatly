import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
export function EditAccount() {
  const formSchema = z.object({
    email: z.string().email({
      message: "Email is not in valid form",
    }),
    username: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`flex justify-center h-full  rounded px-6 flex-col-reverse lg:w-3/4 items-center m-auto`}
    >
      <Form {...form}>
        <form className="space-y-10 flex flex-col w-full m-auto justify-between">
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
                    className={`text-white text-lg py-6 border-0 border-b shadow-none focus-visible:ring-0 border-softBlue`}
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
                    placeholder="Email"
                    type="email"
                    {...field}
                    className={`text-white text-lg py-6 border-0 border-b shadow-none focus-visible:ring-0 border-softBlue`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`rounded bg-softBlue text-white hover:bg-softBlue text-lg p-6 `}
          >
            Submit
          </Button>
        </form>
      </Form>
      <div className={`flex justify-center items-center`}>
        <input type="file" id="profileImage" className="hidden" />
        <label htmlFor="profileImage">
          <div
            className="relative w-64 h-64 rounded-full bg-softBlue cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered && (
              <div className="absolute inset-0 flex justify-center items-center flex-col bg-background bg-opacity-50 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-80">
                <img src="/image-solid.svg" alt="" className="w-10"/>
                <p className="text-white text-xl">Change Image</p>
              </div>
            )}
            <Avatar className="flex justify-center items-center h-full">
              <AvatarImage src="" className="w-full h-full rounded-full overflow-hidden"/>
              <AvatarFallback className="text-3xl">CN</AvatarFallback>
            </Avatar>
          </div>
        </label>
      </div>
    </div>
  );
}
