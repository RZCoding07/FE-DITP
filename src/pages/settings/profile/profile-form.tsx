import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'

const profileFormSchema = z.object({
  fullname: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  rpc: z.string().optional(),
  pks: z.string().optional(),
  kebun: z.string().optional(),
  afd: z.string().optional(),
  account_type: z.string().optional(),
  app_type: z.string().optional(),
  lastLogin: z.string().optional(),
  bio: z.string().max(160).min(4).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isKebunAccount = user.account_type === 'kebun'
  const isRegionalAccount = user.account_type === 'regional'

  const defaultValues: Partial<ProfileFormValues> = {
    fullname: user.fullname || '',
    username: user.username || '',
    email: user.email || '',
    rpc: user.rpc || '',
    pks: user.pks || '',
    kebun: user.kebun || '',
    afd: user.afd || '',
    account_type: user.account_type || '',
    app_type: user.app_type || '',
    lastLogin: user.lastLogin || '',
    bio: 'I own a computer.',
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'Profile Information',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className='flex flex-1 flex-col rounded-lg border bg-card lg:overflow-hidden lg:rounded-lg lg:border lg:bg-card lg:p-6 h-[calc(100vh-200px)]'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 h-full overflow-y-auto p-1'
        >
          {/* Common fields for all account types */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Username' {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='account_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <Input placeholder='Account Type' {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='app_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Type</FormLabel>
                <FormControl>
                  <Input placeholder='Application Type' {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastLogin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Login</FormLabel>
                <FormControl>
                  <Input placeholder='Last Login' {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fields for Kebun account */}
          {isKebunAccount && (
            <>
              <FormField
                control={form.control}
                name='rpc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RPC</FormLabel>
                    <FormControl>
                      <Input placeholder='RPC' {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='pks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PKS</FormLabel>
                    <FormControl>
                      <Input placeholder='PKS' {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='kebun'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kebun</FormLabel>
                    <FormControl>
                      <Input placeholder='Kebun' {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='afd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Afdeling</FormLabel>
                    <FormControl>
                      <Input placeholder='Afdeling' {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Fields for Regional account */}
          {isRegionalAccount && (
            <>
              <FormField
                control={form.control}
                name='rpc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RPC</FormLabel>
                    <FormControl>
                      <Input placeholder='RPC' {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <br />
          <br />


        </form>
      </Form>
    </div>

  )
}