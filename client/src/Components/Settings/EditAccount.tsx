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
import { useChatState } from "../../Context/Provider";
export function EditAccount(props: any) {
  const chatState = useChatState();

  const formSchema = z.object({
    email: z.string().email({
      message: "Email is not in valid form",
    }),
    username: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: chatState.authUser?.email,
      username: chatState.authUser?.username,
    },
  });
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={`h-full flex flex-col`}>
      <div className="py-3 px-5 border-b mb-1 flex items-center gap-4 text-center">
        <img
          src={`/arrow-left-solid.svg`}
          alt="login ilustration"
          className=" w-5 md:hidden flex"
          onClick={props.handleBackClick}
        />
        <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
      </div>
      <div className="flex flex-col-reverse w-full lg:w-3/4 justify-start items-center mx-auto my-10 h-full ">
        <Form {...form}>
          <form className="space-y-5 flex flex-col h-full w-full m-auto justify-center lg:w-3/4">
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
                      className={`rounded  text-white  text-lg py-5`}
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
                      className={`rounded  text-white  text-lg py-5`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`rounded text-white hover:bg-secondary text-lg p-5`}
            >
              Submit
            </Button>
          </form>
        </Form>
        <div className={`flex justify-center items-center`}>
          <input type="file" id="profileImage" className="hidden" />
          <label htmlFor="profileImage">
            <div
              className="relative w-44 h-44 md:w-64 md:h-64 rounded-full bg-secondary cursor-pointer flex justify-center items-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered && (
                <div className="absolute inset-0 flex justify-center items-center flex-col bg-background bg-opacity-50 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-80">
                  <img src="/image-solid.svg" alt="" className="w-10" />
                  <p className="text-white text-xl">Change Image</p>
                </div>
              )}
              <Avatar className="flex justify-center items-center h-full">
                {chatState.authUser?.image ? (
                  <AvatarImage
                    src={chatState.authUser.image}
                    className="w-full h-full rounded-full overflow-hidden"
                  />
                ) : (
                  <AvatarFallback className=" text-7xl flex items-center justify-center w-auto">{chatState.authUser?.username[0].toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
