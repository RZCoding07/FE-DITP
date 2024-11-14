import React, { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { FcDoughnutChart } from 'react-icons/fc'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Overview } from './components/overview'

// react select
import Select from 'react-select'
import { FcBarChart } from 'react-icons/fc'
// custom styles for react select component with tsx
const customStyles = {
  theme: (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'var(--bg-secondary)',
      primary: 'var(--text-primary)',
    },
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--bg-primary)',
    borderColor: 'var(--border-primary)',
    borderRadius: '10.5rem',
    boxShadow: 'none',
    color: 'var(--text-primary)',
    width: '250px', // Set desired width here
    minHeight: '2.5rem',
    '&:hover': {
      borderColor: 'var(--border-primary)',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#fff',
    color: 'black',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '0.5rem',
  }),
  option: (base: any, state: any) => ({
    ...base,
    color: state.isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: state.isSelected ? 'var(--bg-secondary)' : 'var(--bg-primary)',
    whiteSpace: 'nowrap', // Prevent text from wrapping
    overflow: 'hidden', // Hide overflow
    textOverflow: 'ellipsis', // Add ellipsis if text is too long
    '&:hover': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--text-primary)',
  }),
};

import { IconPdf } from '@tabler/icons-react'
import { StokAwal } from './components/stokAwal'

export default function Dashboard() {
  const [stokAwal, setStokAwal] = useState([])
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const bulan = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ] 

  const defaultValue = bulan.find((item) => item.value === currentMonth.toString());

  const fetchStokAwal = async (tahun: number, bulan: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stok-awal-bibit?tahun=${tahun}&bulan=${bulan}`
      )
      const data = response.data
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div className='flex items-center space-x-2'>
            <FcDoughnutChart size={40} />
            <h1 className='text-2xl font-bold tracking-tight'>
              Dashboard Nursery
            </h1>
          </div>
          <h1>Hi, Welcome back 👋</h1>

          <div className='flex items-center space-x-2'>
            <Select
              styles={customStyles}
              options={bulan}
              defaultValue={defaultValue}
            />
            <Button className='flex items-center rounded-full'>
              Download
              <IconPdf size={20} className='ml-2 bg-red-500 text-white' />
            </Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Stok Bibit</TabsTrigger>
              <TabsTrigger value='analytics'>Delivery Kecambah</TabsTrigger>
              <TabsTrigger value='reports'>Kalender</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Pre Nursery
                  </CardTitle>
                  <FcBarChart size={25} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Main Nursery
                  </CardTitle>
                  <FcBarChart size={25} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2350</div>
                  <p className='text-xs text-muted-foreground'>
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Seleksi
                  </CardTitle>
                  <FcBarChart size={25} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <p className='text-xs text-muted-foreground'>
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Siap Salur
                  </CardTitle>
                  <FcBarChart size={25} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <p className='text-xs text-muted-foreground'>
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <Tabs
              orientation='vertical'
              defaultValue='grafik'
              className='space-y-4'
            >
              <div className='w-full overflow-x-auto pb-2'>
                <TabsList>
                  <TabsTrigger value='grafik'>Grafik</TabsTrigger>
                  <TabsTrigger value='analytics'>Rekapitulasi</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value='grafik'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                    <CardHeader>
                      <CardTitle>Stok Awal Bibit</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <StokAwal bulan='9' tahun='2024' />
                    </CardContent>
                  </Card>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                    <CardHeader>
                      <CardTitle>Hasil Seleksi Bibit</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                    <CardHeader>
                      <CardTitle>Bibit Siap Salur</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <Overview />
                    </CardContent>
                  </Card>
                </div>

                <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                    <CardHeader>
                      <CardTitle>Varietas</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className='bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                    <CardHeader>
                      <CardTitle>Bibit Siap Salur vs Kebutuhan Bibit</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                      <Overview />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Nursery',
    href: '/dashboard-nursery',
    isActive: true,
  },
  {
    title: 'Replanting (TU/TK/TB)',
    href: '/dashboard-replanting',
    isActive: false,
  },
  {
    title: 'Immature',
    href: '/dashboard-immature',
    isActive: false,
  },
  {
    title: 'Monica',
    href: '/monica3',
    isActive: false,
  },
]
