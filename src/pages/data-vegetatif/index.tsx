import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.1'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'
import cookies from 'js-cookie'
import { FaFileExcel } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'


export default function Awal() {
  const [Awal, setAwal] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const apiUrl = import.meta.env.VITE_API_IMMATURE

  const user = cookies.get('user')
  const app_type = user ? JSON.parse(user).app_type : 'user'
  const username = user ? JSON.parse(user).username : 'user'
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const kebun = user ? JSON.parse(user).kebun : 'user'
  const regional = user ? JSON.parse(user).rpc : 'user'

  console.log('user', user)

  const fetchInvesAwal = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/vegetatif`, {
        regional,
        kebun,
      })
      setAwal(response.data)
    } catch (error: any) {
      console.error('Error fetching Awal:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  useEffect(() => {
    fetchInvesAwal()
  }, [])

  const exportToExcel = () => {
    if (Awal.length === 0) return

    // Filter and transform data
    const filteredData = Awal.map((item: any) => {
      const {
        status,
        approval,
        cal_jumlah_pelepah,
        cal_lingkar_batang,
        cal_tinggi_tanaman,
        vw_fase_tbm,
        ...rest
      } = item as Record<string, any>

      // Transform vw_fase_tbm
      let formattedFase: string = vw_fase_tbm || ''
      formattedFase = formattedFase.toString().toUpperCase()
      if (formattedFase === 'TBM4') {
        formattedFase = 'TBM>3'
      }

      return {
        ...rest,
        vw_fase_tbm: formattedFase
      }
    })

    // Create worksheet from filtered data
    const worksheet = XLSX.utils.json_to_sheet(filteredData)

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Vegetatif')

    // Set column widths (optional)
    const wscols = [
      { wch: 20 }, // column 1 width
      { wch: 30 }, // column 2 width
      // adjust as needed for your columns
    ]
    worksheet['!cols'] = wscols

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    // Create blob from buffer
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })

    // Save file with desired name
    const fileName = `Data_Vegetatif_${new Date().toLocaleDateString()}.xlsx`
    saveAs(data, fileName)
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>
          <div className='space-y-0.5'>
            {account_type === 'kebun' ? (
              <h2 className='text-2xl font-semibold tracking-tight'>
                Data Pengukuran Vegetatif Kebun {fullname}
              </h2>
            ) : account_type === 'regional' ? (
              <h2 className='text-2xl font-semibold tracking-tight'>
                Data Pengukuran Vegetatif {regional}
              </h2>
            ) : (
              <h2 className='text-2xl font-semibold tracking-tight'>
                Data Pengukuran Vegetatif
              </h2>
            )}

            <p className='text-muted-foreground'>
              Here&apos;s a list of Pengukuran Vegetatif in the system!
            </p>
            <p className='text-muted-foreground text-cyan-400 font-semibold'>
              Nama Varietas harus menyesuaikan dengan template Excel yang diunduh
            </p>
          </div>
          {(account_type === 'HO PalmCo' || account_type === 'Superadmin' || account_type == 'kebun') && (
            <div className='ml-auto flex space-x-2'>
              <a
                className='flex cursor-pointer rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300'
                href='/Format Pengukuran Vegetatif 2025.xlsx'
                download
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFileExcel className='mr-2 h-5 w-5' /> Download Template
              </a>
              <Link
                to='/upload-pengukuran-vegetatif'
                className='flex cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
              >
                <span className='flex items-center justify-center'>

                  <span className='ml-2'>Upload Data</span>
                </span>

              </Link>
              <button
                onClick={exportToExcel}
                className='flex cursor-pointer rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300'
              >
                <FaFileExcel className='mr-2 h-5 w-5' />
                Export Excel
              </button>

            </div>
          )}
        </div>

        <div className='flex-1 overflow-auto rounded-lg bg-slate-50 bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable data={Awal} columns={columns} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
