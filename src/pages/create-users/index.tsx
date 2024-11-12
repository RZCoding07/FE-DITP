import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ThemeSwitch from '@/components/theme-switch'
import { Link, useNavigate } from 'react-router-dom'

export default function CreateUser() {
  const form = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      avatar: '',
      username: '',
      password: '',
      role: 'admin',
      rpc: '',
      kebun: '',
      afdeling: '',
      account_type: 'standard',
    },
  })

  const navigate = useNavigate()
  const [role, setRole] = useState('admin')

  const onSubmit = async (data: any) => {
    const apiUrl = import.meta.env.VITE_API_MASTER;
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_TOKEN_HERE', // Replace with your token
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('User created successfully!')
        form.reset()
        navigate('/users')
      } else {
        toast.error('Failed to create user.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <Card>
          <CardHeader>
            <CardTitle>Create Data Users</CardTitle>
            <CardDescription>Add a new user to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='fullname'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input type='email' {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setRole(value) // Update role state
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a role' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='viewer'>Viewer</SelectItem>
                          <SelectItem value='rpc'>RPC</SelectItem>
                          <SelectItem value='kebun'>Kebun</SelectItem>
                          <SelectItem value='afdeling'>Afdeling</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {
                  role !== 'admin' &&
                  role !== 'viewer' &&
               (
                    <FormField
                      control={form.control}
                      name='rpc'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RPC</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                {role !== 'rpc' && role !== 'admin' && role !== 'viewer' && (
                  <FormField
                    control={form.control}
                    name='kebun'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kebun</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {role !== 'rpc' &&
                  role !== 'admin' &&
                  role !== 'viewer' &&
                  role !== 'kebun' && (
                    <FormField
                      control={form.control}
                      name='afdeling'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Afdeling</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
<FormField
  control={form.control}
  name='account_type'
  render={({ field }) => (
    <FormItem>
      <FormLabel>Account Type</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={'nursery'} 
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder='Select account type' />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value='nursery'>Nursery</SelectItem>
          <SelectItem value='replanting'>Replanting</SelectItem>
          <SelectItem value='immature'>Immature</SelectItem>
          <SelectItem value='monica'>Monica</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


                <div className='flex items-center justify-between'>
                  <Button type='submit' className='bg-slate-600'>
                    Create User
                  </Button>
                  <Button type='button'>
                    <Link to='/users'>Kembali</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
