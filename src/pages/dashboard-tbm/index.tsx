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
import { Overview } from './components/overview'
import cookie from 'js-cookie'
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import { RobotInvestasi } from '@/components/loatie'
import { Summary } from '@/components/summary'
import { useForm, Controller } from "react-hook-form";
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
    backgroundColor: state.isSelected
      ? 'var(--bg-secondary)'
      : 'var(--bg-primary)',
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
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: state.theme.mode === 'dark' ? 'white' : 'var(--text-secondary)',
  }),
};


import { IconPdf } from '@tabler/icons-react'
import { StokAwal } from './components/stokAwal'

export default function Dashboard() {
  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'
  console.log(user)

  const [stokAwal, setStokAwal] = useState([])
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({});

  const bulanName = [
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

  const tahunName = [
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' },
    { value: '2031', label: '2031' },
    { value: '2032', label: '2032' },
    { value: '2033', label: '2033' },
    { value: '2034', label: '2034' },
    { value: '2035', label: '2035' },
  ]

  const defaultValueBulan = bulanName.find(
    (item) => item.value === currentMonth.toString()
  )

  const defaultValueTahun = tahunName.find(
    (item) => item.value === currentYear.toString()
  )

  const rpc = watch("rpc");
  const kebun = watch("kebun");
  const blok = watch("blok");
  const afd = watch("afd");
  const bulan = watch("bulan");
  const tahun = watch("tahun");


    // Keseeluruhan
    const [hitam, setHitam] = useState(0);
    const [hijau, setHijau] = useState(0);
    const [kuning, setKuning] = useState(0);
    const [oren, setOren] = useState(0);
    const [total, setTotal] = useState(0);
    const [rpcOptions, setRpcOptions] = useState([]);
    const [kebunOptions, setKebunOptions] = useState([]);

    const fetchRpcOptions = async (tahun: number, bulan: number) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rpc/${tahun}/${bulan}`);
        const data = response.data;
        const regionalOptions = data.map((item: { rpc: string }) => ({
          value: item.rpc,
          label: item.rpc,
        }));
        setRpcOptions(regionalOptions);
      } catch (error) {
        console.error("Error fetching rpc options:", error);
      }
    };
  

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
              Dashboard PICA TBM
            </h1>
          </div>
          {/* <h1>Hai, {fullname}, <br/> Selamat Datang di EV4PALMS ! 👋</h1> */}

          <div className='flex items-center space-x-2'>
            <Select
              styles={customStyles}
              options={tahunName}
              defaultValue={defaultValueTahun}
            />

            <Select
              styles={customStyles}
              options={bulanName}
              defaultValue={defaultValueBulan}  
            />

            <Button className='flex items-center rounded-full'>
              Download
              <IconPdf size={20} className='ml-2 bg-red-500 text-white' />
            </Button>
          </div>
        </div>

        <div className='py-5'>
        <div className="rounded-xl bg-gradient-to-r from-blue-500 via-green-500 to-green-500 p-6 py-5 shadow-lg">
            <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between'>
              <div>
                <h4 className='text-2xl font-bold text-white'>
                  Selamat Datang Di PICA TBM
                </h4>
                <p className='text-white'>
                  Problem Identification & Corrective Action TBM PT Perkebunan
                  Nusantara IV
                </p>
              </div>
              <div className='float-right'>
            {/* <Player
              autoplay
              loop
              src='/EgrO8YnIZJ.json'
              style={{ height: '100px', width: '100px'
                

              }}
            >
              <Controls
                visible={false}
                buttons={['play', 'repeat', 'frame', 'debug']}
              />
            </Player> */}
          </div>
            </div>
          </div>

        </div>
        <Summary
          data={{
            hijau: hijau,
            kuning: kuning,
            oren: oren,
            hitam: hitam,
          }}
        />
         <div className="grid grid-cols-4 gap-1 mt-5 align-end items-center">
            <h2 className="text-2xl font-bold">Data PICA Cluster <strong>{bulanName[bulan - 1]?.label} {tahun}</strong>
              <br />
              <strong>
                {rpc ? rpc.label : ""} {kebun ? " - " + kebun.label : ""} {afd ? " - " + afd.label : ""}
              </strong>
            </h2>
            <div>
              <Controller
                name="rpc"
                control={control}
                render={({ field }) => (
                  <Select
                  styles={customStyles}
                    placeholder="Pilih RPC"
                    isSearchable
                    options={rpcOptions}
                    {...field}
                    value={rpc}

                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="kebun"
                control={control}
                render={({ field }) => (
                  <Select
                  styles={customStyles}
                    placeholder="Pilih Kebun"
                    isSearchable
                    options={kebunOptions}
                    {...field}
                    value={kebun}

                  />
                )}
              />
            </div>
            </div>
        <div className="float-end -mt-20">
        <RobotInvestasi />

        </div>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: '/dashboard-tbm',
    isActive: true,
  },
  {
    title: 'Luas Areal Statement',
    href: '/luas-areal',
    isActive: false,
  },
  {
    title: 'Pengukuran Vegetatif',
    href: '/data-vegetatif',
    isActive: false,
  },
]
