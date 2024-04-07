import React from "react";
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
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChatState } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";

function ChangePassword(props: any) {
  const chatState = useChatState();
  const router = useNavigate()
  const formSchema = z
    .object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const changePassword = async (values: z.infer<typeof formSchema>)=>{
    const {currentPassword,newPassword } = values
    try{
      axios.put("http://localhost:5500/api/changePassword",{
        currentPassword,newPassword
      },{
        withCredentials:true
      })
      console.log("Password is changed");
      chatState.removeCookie(["chatly.session-token"])
      router("/Account/Login")      
    }catch(err:any){
      if(err.response.status === 400) {
        form.setError("currentPassword", {
          message: "Invalid current password",
        });
      }
    }
  }
  return (
    <div>
      <div className="px-3 flex flex-col gap-3">
        <div className="py-2  border-b mb-1 flex items-center gap-4 text-center w-full">
          <img
            src={`/arrow-left-solid.svg`}
            alt="login ilustration"
            className=" w-5 md:hidden flex"
            onClick={props.handleBackClick}
          />
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Change Password
          </h1>
        </div>
        <p className="text-lg">
          Welcome to the password change page. Here you can enter your current
          password, then set a new password.
        </p>
        <h1 className="text-xl md:text-2xl ">How it Works?</h1>
        <ol className=" list-decimal px-5 text-base">
          <li>
            Enter a your current password in the field marked as "Current
            Password"
          </li>
          <li>Set a new password in the field marked as "New Password"</li>
          <li>
            Confirm your new password by re-enterning it in the field mared as
            "Confirm Password"
          </li>
          <li>Click on "Change Password" button to confirm the change</li>
        </ol>
        <Form {...form}>
          <form className="space-y-2 flex flex-col w-full lg:w-3/4 xl:w-1/2 justify-between" onSubmit={form.handleSubmit(changePassword)}>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Current Password"
                      type="password"
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New Password"
                      type="password"
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
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm New Password"
                      type="password"
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
              Change Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChangePassword;
