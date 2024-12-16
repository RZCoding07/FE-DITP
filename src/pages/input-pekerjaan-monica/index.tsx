'use client';

import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the schema for form validation
const formSchema = z.object({
  kode: z.string().min(1, { message: 'Kode investasi harus diisi!' }),
});

type FormValues = z.infer<typeof formSchema>;

// Define the type for the API response
interface SearchResult {
  // Add the expected properties of your API response here
  // For example:
  id: string;
  name: string;
  // ... other properties
}

export default function SearchKodeInvestasi() {
  const [result, setResult] = useState<SearchResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: '',
    },
  });

  const { isSubmitting } = form.formState;

  const handleSearch = async (values: FormValues) => {
    try {
      const response = await axios.get<SearchResult>(`/api/pekerjaan?kode=${values.kode}`);
      setResult(response.data);
      toast.success('Data ditemukan!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan!');
      } else {
        toast.error('Terjadi kesalahan yang tidak diketahui!');
      }
    }
  };

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
        <CardTitle>Cari Kode Investasi</CardTitle>
        <CardDescription>Masukkan kode investasi untuk mencari data terkait.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSearch)}
          >
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Investasi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan kode investasi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mencari...' : 'Cari Kode Investasi'}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-4">
            <h4 className="font-bold">Hasil Pencarian:</h4>
            <pre className="p-2 bg-gray-100 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
          </Layout.Body>
          </Layout>
  );
}

