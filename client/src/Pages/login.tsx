import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChatState } from '../Context/Provider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../Components/ui/form';
import { Input } from '../Components/ui/input';

export function Login() {
  const router = useNavigate();
  const chatState = useChatState();

  const formSchema = z.object({
    email: z.string().email({
      message: 'Email is not in valid form',
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/authUser`, {
        email,
        password,
      });

      if (res.status === 200) {
        const data = await res.data;
        chatState?.setCookie('chatly.session-token', data.token, data.cookieOptions);
        console.log(data.token, data.cookieOptions);
        
        router('/'); 
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        form.setError('email', { message: '' });
        form.setError('password', { message: 'Invalid username or password' });
      } else if (err.response && err.response.status === 404) {
        form.setError('email', { message: '' });
        form.setError('password', { message: 'Account is deleted' });
      } else {
        console.error('An error occurred:', err);
      }
    }
  }

  return (
    <div className="flex justify-center h-screen md:h-5/6 bg-background w-screen md:w-11/12 lg:w-3/4 rounded px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col w-full m-auto md:w-1/2 justify-between">
          <h1 className="text-5xl font-bold">Welcome Back</h1>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} className="rounded bg-softBlue text-white hover:bg-softBlue text-lg py-6" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} className="rounded bg-softBlue text-white hover:bg-softBlue text-lg py-6" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <span className="flex gap-1 items-center text-base">
            Do not have an account?
            <Link to="/Account/Register" className="underline text-lg font-semibold">Register</Link>
          </span>
          <Button type="submit" className="rounded bg-softBlue text-white hover:bg-softBlue text-lg p-6">Submit</Button>
        </form>
      </Form>
      <div className="invisible w-0 overflow-hidden md:w-1/2 md:visible flex justify-center items-center">
        <img src="/login_ilustration.svg" alt="login ilustration" className="w-96" />
      </div>
    </div>
  );
}
