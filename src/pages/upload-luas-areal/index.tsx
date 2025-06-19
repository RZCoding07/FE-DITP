'use client'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import React, { useState, useEffect } from 'react'
import cookie from 'js-cookie'
import Papa from 'papaparse'
import { BsFillCheckCircleFill, BsTrash } from 'react-icons/bs'
import readXlsxFile from 'read-excel-file'
import { FaFileExcel } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, CircularProgress, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { customStyles } from '@/styles/select-styles'

export default function UploadAreal() {
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const user = JSON.parse(cookie.get('user') || '{}')

  interface ArealData {
    id?: number;
    nama_kebun_sap: string;
    kode_kebun: string;
    tahun_tbm: number;
    luasan: number;
    bulan: number;
    tahun: number;
  }

  const [mappedData, setMappedData] = useState<ArealData[]>([])
  const [values, setValues] = useState<any[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1)
  const [tahun, setTahun] = useState<number>(new Date().getFullYear())

  const bulanName = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ]

  const tahunName = Array.from({ length: 15 }, (_, i) => ({
    value: 2021 + i,
    label: (2021 + i).toString()
  }))

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) await parseFile(file)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await parseFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const parseFile = async (file: File) => {
    setLoading(true)
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    try {
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          skipEmptyLines: true,
          complete: (results) => {
            setValues(results.data.slice(1))
            setFileName(file.name)
          },
        })
      } else if (fileExtension === 'xlsx') {
        const results = await readXlsxFile(file)
        setValues(results.slice(1))
        setFileName(file.name)
      } else {
        toast.error('Format file tidak didukung. Harap upload file .csv atau .xlsx')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error parsing file')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setValues([])
    setFileName(null)
    setMappedData([])
  }

  // Validate and map data
  useEffect(() => {
    if (values.length > 0) {
      const validData: ArealData[] = []
      
      values.forEach(row => {
        // Skip empty rows
        if (!row[0] && !row[1] && !row[2] && !row[3]) return
        
        const nama_kebun_sap = row[0]?.toString().trim() || ''
        const kode_kebun = row[1]?.toString().trim() || ''
        const tahun_tbm = parseInt(row[2]) || 0
        const luasan = parseFloat(row[3]) || 0
        
        // Only add if required fields are present
        if (nama_kebun_sap && kode_kebun && !isNaN(tahun_tbm) && !isNaN(luasan)) {
          validData.push({
            nama_kebun_sap,
            kode_kebun,
            tahun_tbm,
            luasan,
            bulan,
            tahun
          })
        }
      })

      setMappedData(validData)
      
      // Show warning if some rows were skipped
      if (validData.length < values.length) {
        const skipped = values.length - validData.length
        toast.error(`${skipped} baris tidak valid dan akan diabaikan`)
      }
    }
  }, [values, bulan, tahun])

  const router = useNavigate()

  const handleUploadAreal = async () => {
    if (mappedData.length === 0) {
      toast.error('Tidak ada data yang valid untuk diupload');
      return;
    }
  
    setIsLoadingUpload(true);
    setIsUploadingDone(false);
    setProgressValue(0);
    
    const apiUrl = import.meta.env.VITE_API_IMMATURE as string;
    const CHUNK_SIZE = 100;
    const totalChunks = Math.ceil(mappedData.length / CHUNK_SIZE);
    let stats = {
      inserted: 0,
      updated: 0,
      duplicates: 0,
      failed: 0
    };
  
    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;
        const chunk = mappedData.slice(start, end);

        console.log('Uploading chunk:', chunk);
  
        try {
          const response = await fetch(`${apiUrl}/areal/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookie.get('token')}`
            },
            body: JSON.stringify({
              mappedData: chunk,
              bulan,
              tahun
            }),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const result = await response.json();
          if (result.stats) {
            stats.inserted += result.stats.inserted;
            stats.updated += result.stats.updated;
            stats.duplicates += result.stats.duplicates;
          }
        } catch (error) {
          console.error(`Error uploading chunk ${i + 1}:`, error);
          stats.failed += chunk.length;
        }
  
        setProgressValue(((i + 1) / totalChunks) * 100);
      }
  
      // Show summary toast
      let message = [
        stats.inserted > 0 && `${stats.inserted} data baru ditambahkan`,
        stats.updated > 0 && `${stats.updated} data diperbarui`,
        stats.duplicates > 0 && `${stats.duplicates} data duplikat diabaikan`,
        stats.failed > 0 && `${stats.failed} data gagal diproses`
      ].filter(Boolean).join(', ');
  
      if (stats.failed === 0) {
        toast.success(`Upload selesai: ${message}`);
        setIsUploadingDone(true);
        setTimeout(() => router('/luas-areal'), 2000);
      } else {
        toast.error(`Upload selesai dengan beberapa error: ${message}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Terjadi kesalahan saat mengupload data: ${error.message}`);
    } finally {
      setIsLoadingUpload(false);
    }
  };

  const getCurrentMonth = () => {
    const date = new Date()
    return date.getMonth() + 1
  }

  const getCurrentYear = () => {
    const date = new Date()
    return date.getFullYear()
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
            <CardTitle>Upload Data Areal</CardTitle>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                Upload file .csv atau .xlsx untuk menambahkan data areal
              </p>
            </div>
            <div className='flex items-center'>
              <Select
                options={bulanName}
                styles={ customStyles}
                className='mr-5 w-1/4'
                defaultValue={bulanName[getCurrentMonth() - 1]}
                onChange={(e: any) => setBulan(e.value)}
              />
              <Select
                options={tahunName}
                className='mr-5 w-1/4'
                styles={customStyles}
                defaultValue={tahunName.find(
                  item => item.value === getCurrentYear()
                )}
                onChange={(e: any) => setTahun(e.value)}
              />

              <button
                className='flex cursor-pointer rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300'
                onClick={() => router('/download-template-areal')}
              >
                <FaFileExcel className='mr-2 h-5 w-5' /> Download Template
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='mt-5 grid'>
              <div
                className='flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-black py-5'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <label
                  className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-dashed'
                  htmlFor='fileInput'
                >
                  <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                    <svg
                      aria-hidden='true'
                      className='mb-3 h-10 w-10 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                      ></path>
                    </svg>
                    {fileName ? (
                      <div className='mb-2 flex items-center'>
                        <p className='text-sm text-gray-500'>{fileName}</p>
                        <BsTrash
                          className='ml-2 cursor-pointer text-red-500'
                          onClick={handleRemoveFile}
                        />
                      </div>
                    ) : loading ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress />
                        <Typography variant='body1' sx={{ mt: 2 }}>
                          Memproses file...
                        </Typography>
                      </Box>
                    ) : (
                      <p className='mb-2 text-sm text-gray-500'>
                        <span className='font-semibold'>
                          Klik untuk upload file .csv atau .xlsx
                        </span>{' '}
                        atau drag and drop
                      </p>
                    )}
                  </div>

                  <input
                    type='file'
                    id='fileInput'
                    name='file'
                    onChange={handleFileChange}
                    accept='.csv, .xlsx'
                    className='hidden'
                    disabled={isLoadingUpload}
                  />
                </label>
              </div>
              <div className='mt-5 flex items-center justify-end gap-3'>
                {isLoadingUpload && (
                  <div className='h-2.5 w-1/6 rounded-full bg-gray-200'>
                    <div
                      className='h-2.5 rounded-full bg-green-600 transition ease-in-out'
                      style={{ width: `${progressValue}%` }}
                    ></div>
                  </div>
                )}

                {isUploadingDone && (
                  <BsFillCheckCircleFill className='h-7 w-7 text-green-600' />
                )}

                {!isLoadingUpload && (
                  <button
                    onClick={handleUploadAreal}
                    disabled={!fileName || isLoadingUpload}
                    className='cursor-pointer rounded-full bg-green-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-not-allowed'
                  >
                    Upload File
                  </button>
                )}
                <button className='cursor-pointer rounded-full bg-slate-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300'>
                  <Link to='/luas-areal'>Kembali</Link>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}