import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import ThemeSwitch from '@/components/theme-switch'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function Editvegetatif() {
  const { id } = useParams()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      regional: '',
      kebun: '',
      afdeling: '',
      blok: '',
      tahun_tanam: '',
      varietas: '',
      luas_ha: '',
      jumlah_pokok_awal_tanam: '',
      jumlah_pokok_sekarang: '',
      tinggi_tanaman_cm: '',
      jumlah_pelepah_bh: '',
      panjang_rachis_cm: '',
      lebar_petiola_cm: '',
      tebal_petiola_cm: '',
      rerata_panjang_anak_daun: '',
      rerata_lebar_anak_daun: '',
      lingkar_batang_cm: '',
      tahun: '',
      bulan: '',
      bulan_tanam: '',
      fase_tbm: '',
      umur_saat_ini_bulan: '',
      pkk_ha_awal_tanam: '',
      pkk_ha_saat_ini: '',
      jumlah_anak_daun: '',
      jumlah_pokok_sampel: '',
      tanggal_pengamatan: '',
    },
  })

  useEffect(() => {
    const fetchvegetatif = async () => {
      const apiUrl = import.meta.env.VITE_API_IMMATURE;
      try {
        const response = await fetch(`${apiUrl}/vegetatif/${id}`);
        if (response.ok) {
          const vegetatif = await response.json();
            form.reset(vegetatif);
        }
      } catch (error) {
        console.error('Error fetching vegetatif:', error);
        toast.error('An error occurred. Please try again.');
      }
    };
  
    fetchvegetatif();
  }, [id, form]);

  const onSubmit = async (data: any) => {
    const apiUrl = import.meta.env.VITE_API_IMMATURE;
    try {
      const response = await fetch(`${apiUrl}/vegetatif/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('vegetatif updated successfully!')
        navigate('/data-vegetatif')
      } else {
        toast.error('Failed to update vegetatif.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <Card>
          <CardHeader>
            <CardTitle>Edit Data vegetatif</CardTitle>
            <CardDescription>Edit an existing vegetatif in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Regional */}
                  <FormField
                    control={form.control}
                    name='regional'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regional</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Kebun */}
                  <FormField
                    control={form.control}
                    name='kebun'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kebun</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Afdeling */}
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

                  {/* Blok */}
                  <FormField
                    control={form.control}
                    name='blok'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blok</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tahun Tanam */}
                  <FormField
                    control={form.control}
                    name='tahun_tanam'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun Tanam</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Varietas */}
                  <FormField
                    control={form.control}
                    name='varietas'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varietas</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Luas Ha */}
                  <FormField
                    control={form.control}
                    name='luas_ha'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luas (Ha)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jumlah Pokok Awal Tanam */}
                  <FormField
                    control={form.control}
                    name='jumlah_pokok_awal_tanam'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Pokok Awal Tanam</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jumlah Pokok Sekarang */}
                  <FormField
                    control={form.control}
                    name='jumlah_pokok_sekarang'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Pokok Sekarang</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tinggi Tanaman (cm) */}
                  <FormField
                    control={form.control}
                    name='tinggi_tanaman_cm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tinggi Tanaman (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jumlah Pelepah (bh) */}
                  <FormField
                    control={form.control}
                    name='jumlah_pelepah_bh'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Pelepah (bh)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Panjang Rachis (cm) */}
                  <FormField
                    control={form.control}
                    name='panjang_rachis_cm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panjang Rachis (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lebar Petiola (cm) */}
                  <FormField
                    control={form.control}
                    name='lebar_petiola_cm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lebar Petiola (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tebal Petiola (cm) */}
                  <FormField
                    control={form.control}
                    name='tebal_petiola_cm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tebal Petiola (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Rerata Panjang Anak Daun */}
                  <FormField
                    control={form.control}
                    name='rerata_panjang_anak_daun'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rerata Panjang Anak Daun</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Rerata Lebar Anak Daun */}
                  <FormField
                    control={form.control}
                    name='rerata_lebar_anak_daun'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rerata Lebar Anak Daun</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lingkar Batang (cm) */}
                  <FormField
                    control={form.control}
                    name='lingkar_batang_cm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lingkar Batang (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tahun */}
                  <FormField
                    control={form.control}
                    name='tahun'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bulan */}
                  <FormField
                    control={form.control}
                    name='bulan'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bulan</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bulan Tanam */}
                  <FormField
                    control={form.control}
                    name='bulan_tanam'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bulan Tanam</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fase TBM */}
                  <FormField
                    control={form.control}
                    name='fase_tbm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fase TBM</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Umur Saat Ini (bulan) */}
                  <FormField
                    control={form.control}
                    name='umur_saat_ini_bulan'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Umur Saat Ini (bulan)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PKK Ha Awal Tanam */}
                  <FormField
                    control={form.control}
                    name='pkk_ha_awal_tanam'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PKK Ha Awal Tanam</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PKK Ha Saat Ini */}
                  <FormField
                    control={form.control}
                    name='pkk_ha_saat_ini'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PKK Ha Saat Ini</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jumlah Anak Daun */}
                  <FormField
                    control={form.control}
                    name='jumlah_anak_daun'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Anak Daun 1 Sisi </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jumlah Pokok Sampel */}
                  <FormField
                    control={form.control}
                    name='jumlah_pokok_sampel'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Pokok Sampel</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tanggal Pengamatan */}
                  <FormField
                    control={form.control}
                    name='tanggal_pengamatan'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Pengamatan</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex items-center gap-3'>
                  <Button type='submit' className='bg-slate-600 text-white'>
                    Update vegetatif
                  </Button>
                  <Button type='button' variant="outline">
                    <Link to='/data-vegetatif'>Kembali</Link>
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