import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, redirect } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import cookie from 'js-cookie'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { format, subDays } from "date-fns"

export type UserData = {
  id: string;
  fullname: string;
  username: string;
  rpc: string;
  pks: string;
  kebun: string;
  afd: string;
  refreshToken: string;
  account_type: string;
  app_type: string;
  email: string;
  lastLogin: Date;
  avatar: string;

};

type AuthContextType = {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Please enter your email or username' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(3, { message: 'Password must be at least 3 characters long' }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_MASTER;
  const navigate = useNavigate();
  const location = useLocation();

  const getDataUserLogin = async (token: string) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${apiUrl}/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.payload;

      localStorage.setItem("user", JSON.stringify(data));
      setUserData(data);
      toast.success("Login Successful!");
      cookie.set("user", JSON.stringify(data));
      const dari_tanggal = format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
      const sampai_tanggal = format(new Date(), "yyyy-MM-dd");
      const user = cookie.get('user')
      const rpc = user ? JSON.parse(user).rpc : ''
      const app_type = user ? JSON.parse(user).app_type : ''
      const account_type = user ? JSON.parse(user).account_type : ''

      setTimeout(() => {
        // ?dari_tanggal=2025-06-22&sampai_tanggal=2025-07-22&regional=1
        if (rpc != '' && account_type === 'regional' && app_type == 'monev') {
          window.location.href = `/?dari_tanggal=${dari_tanggal}&sampai_tanggal=${sampai_tanggal}&regional=${data.rpc}`;

        } else {
          window.location.href = `/`;
        }

      }, 1000);

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (identifier: string, password: string) => {
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (data.status_code === 200) {
      console.log(data);
      cookie.set("token", JSON.stringify(data));
      setIsLoading(false);
      await getDataUserLogin(data.payload.access_token);
    } else {
      setIsError(true);
      toast.error(data.message);
      setIsLoading(false);
      setTimeout(() => {
        setIsError(false);
        setErrorMessage(null);
      }, 5000);
    }
    setIsLoading(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',  // email is not required
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      login(data.identifier, data.password)
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem className='space-y-4'>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan Email / Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4' loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
