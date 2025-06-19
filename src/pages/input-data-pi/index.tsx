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

// Slugify function
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

interface ObjW {
    value: string
    label: string
}

interface FormValues {
    w1: ObjW
    w2: ObjW
    w3: ObjW
    measurement: string
}



export default function AddUraianPekerjaanForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const form = useForm<FormValues>({
        defaultValues: {
            w1: { value: '', label: '' },
            w2: { value: '', label: '' },
            w3: { value: '', label: '' },
            measurement: ''
        },
    })


    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        try {
            const apiUrl = import.meta.env.VITE_API_IMMATURE

            // Transforming input to include slug
            const transformedData = {
                w1: {
                    label: data.w1.label,
                    value: slugify(data.w1.label),
                },
                w2: {
                    label: data.w2.label,
                    value: slugify(data.w2.label),
                },
                w3: {
                    label: data.w3.label,
                    value: slugify(data.w3.label),
                },
                measurement: data.measurement,
            };


            await axios.post(`${apiUrl}/why`, transformedData)
            toast.success('Data berhasil disimpan')
            navigate('/data-pi')
        } catch (error) {
            console.error('Error submitting form:', error)
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
                        <CardTitle>Tambah Data Problem Identification</CardTitle>
                        <CardDescription>Tambahkan data problem identification</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                {/* Form fields for w1, w2, w3, and measurement */}
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                    <FormField
                                        control={form.control}
                                        name='w1.label'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>W1 Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const label = e.target.value
                                                            form.setValue('w1', {
                                                                label,
                                                                value: slugify(label),
                                                            })
                                                        }}
                                                        placeholder='Enter W1 label'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='w2.label'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>W2 Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const label = e.target.value
                                                            form.setValue('w2', {
                                                                label,
                                                                value: slugify(label),
                                                            })
                                                        }}
                                                        placeholder='Enter W2 label'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='w3.label'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>W3 Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const label = e.target.value
                                                            form.setValue('w3', {
                                                                label,
                                                                value: slugify(label),
                                                            })
                                                        }}
                                                        placeholder='Enter W3 label'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <FormField
                                    control={form.control}
                                    name='measurement'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Measurement</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Enter measurement' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex space-x-3'>
                                    <Button type='submit' disabled={isSubmitting}>
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => navigate('/data-pi')}
                                    >
                                        Kembali
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