'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'

import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'

interface FormValues {
jenis_pekerjaan: string,
  uraian_pekerjaan: string
}

export default function AddUraianPekerjaanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    defaultValues: {
        jenis_pekerjaan: '',
      uraian_pekerjaan: ''
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const apiUrl = import.meta.env.VITE_API_REPLANTING
      await axios.post(`${apiUrl}/uraian-pekerjaan/upload`, data)
      toast.success('Data berhasil disimpan')
      navigate('/replanting')
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
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
            <CardTitle>Tambah Uraian Pekerjaan</CardTitle>
            <CardDescription>Tambahkan uraian pekerjaan baru ke sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                {/* Jenis Pekerjaan */}
                <FormField
                  control={form.control}
                  name='jenis_pekerjaan'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Pekerjaan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='uraian_pekerjaan'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uraian Pekerjaan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
                {/* Kembali */}
                  <Button onClick={() => navigate('/replanting')} className='bg-gray-200 text-gray-800 ml-3 onhover:bg-gray-300'>
                    Kembali
                    </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}

