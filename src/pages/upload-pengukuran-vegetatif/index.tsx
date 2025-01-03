'use client'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import React, { useState, useEffect, useRef, useId } from 'react'
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
import axios from 'axios'

export default function UploadVegetatif() {
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

  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const user = JSON.parse(cookie.get('user') || '{}')

  interface UploadData {
    entitas: string;
    kebun: string;
    afd: string;
    tahunTanam: number;
    blok: string;
    luas: number;
    sph: number;
    varietas: string;
    lingkarBatang: number | null;
    tinggiBatang: number | null;
    jumlahPelepah: number | null;
    panjangRachis: number | null;
    lebarPetiolaL: number | null;
    lebarPetiolaT: number | null;
    jad: number | null;
    measurement1L: number | null;
    measurement1P: number | null;
    measurement2L: number | null;
    measurement2P: number | null;
    measurement3L: number | null;
    measurement3P: number | null;
    measurement4L: number | null;
    measurement4P: number | null;
    measurement5L: number | null;
    measurement5P: number | null;
    measurement6L: number | null;
    measurement6P: number | null;
    rerataL: number | null;
    rerataP: number | null;
  }

  const [mappedData, setMappedData] = useState<UploadData[]>([])
  const [values, setValues] = useState<any[]>([])
  const [fileName, setFileName] = useState(null)
  const [loading, setLoading] = useState(false)

  const [bulan, setBulan] = useState(null)
  const [tahun, setTahun] = useState(null)

  const getCurrentMonth = () => {
    const date = new Date()
    return date.getMonth()
  }

  const getCurrentYear = () => {
    const date = new Date().getFullYear()
    return date
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleDrop = async (event: any) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      await parseFile(file)
    }
  }

  const handleFileChange = async (event: any) => {
    const file = event.target.files?.[0]
    if (file) {
      await parseFile(file)
    }
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const parseFile = async (file: any) => {
    setLoading(true)
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    try {
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          skipEmptyLines: true,
          complete: (results) => {
            const rowsArray = []
            const valuesArray: any[] = []

            results.data.forEach((d: any) => {
              rowsArray.push(Object.keys(d))
              valuesArray.push(Object.values(d))
            })

            setValues(valuesArray.slice(1))
            setFileName(file.name)
          },
        })
      } else if (fileExtension === 'xlsx') {
        const results = await readXlsxFile(file)
        const rowsArray = []
        const valuesArray: any[] = []

        results.forEach((row) => {
          const rowValues = row.map((cell) =>
            cell !== null ? cell.toString() : ''
          )
          rowsArray.push(rowValues)
          valuesArray.push(rowValues)
        })

        setValues(valuesArray.slice(1))
        setFileName(file.name)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setValues([])
    setFileName(null)
    setLoading(false)
  }

  useEffect(() => {
    if (values.length > 0) {
    }
  }, [values]) // Add this line

  useEffect(() => {
    if (values.length > 0) {
      const mapped = values.map((value) => ({
        entitas: value[0],
        kebun: value[1],
        afd: value[2],
        tahunTanam: value[3],
        blok: value[4],
        luas: value[5],
        sph: value[6],
        varietas: value[7],
        lingkarBatang: value[8] ? Number(value[8]) : null,
        tinggiBatang: value[9] ? Number(value[9]) : null,
        jumlahPelepah: value[10] ? Number(value[10]) : null,
        panjangRachis: value[11] ? Number(value[11]) : null,
        lebarPetiolaL: value[12] ? Number(value[12]) : null,
        lebarPetiolaT: value[13] ? Number(value[13]) : null,
        jad: value[14] ? Number(value[14]) : null,
        measurement1L: value[15] ? Number(value[15]) : null,
        measurement1P: value[16] ? Number(value[16]) : null,
        measurement2L: value[17] ? Number(value[17]) : null,
        measurement2P: value[18] ? Number(value[18]) : null,
        measurement3L: value[19] ? Number(value[19]) : null,
        measurement3P: value[20] ? Number(value[20]) : null,
        measurement4L: value[21] ? Number(value[21]) : null,
        measurement4P: value[22] ? Number(value[22]) : null,
        measurement5L: value[23] ? Number(value[23]) : null,
        measurement5P: value[24] ? Number(value[24]) : null,
        measurement6L: value[25] ? Number(value[25]) : null,
        measurement6P: value[26] ? Number(value[26]) : null,
        rerataL: value[27] ? Number(value[27]) : null,
        rerataP: value[28] ? Number(value[28]) : null,
        tahun: tahun || getCurrentYear(),
        bulan: bulan || getCurrentMonth() + 1,
      }))

      setMappedData(mapped)
      console.log(mapped) // Log mappedData here
    }
  }, [values])

  const router = useNavigate()

  const apiUrl = import.meta.env.VITE_API_IMMATURE

  const handleUpload = async (): Promise<void> => {
    setIsLoadingUpload(true)
    // const loginData = cookie.get("token");
    // const tokenData = JSON.parse(loginData || "{}");

    const chunkSize = Math.ceil(mappedData.length / 10)
    const uploadPromises = []

    for (let i = 0; i < 10; i++) {
      const chunk = mappedData.slice(i * chunkSize, (i + 1) * chunkSize)
      uploadPromises.push(
        fetch(`${apiUrl}/vegetatif/upload`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // "Authorization": `Bearer ${tokenData.payload.access_token}`,
          },
          body: JSON.stringify({
            mappedData: chunk,
          }),
        }).then((res) => res.json())
      )
    }

    const results = await Promise.all(uploadPromises)

    const allSuccessful = results.every((result) => result.status_code === 200)

    const totalBatches = 10
    for (let i = 0; i < totalBatches; i++) {
      const progressPercent = ((i + 1) * 100) / totalBatches
      setProgressValue(progressPercent)
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    if (allSuccessful) {
      setIsUploadingDone(true)
    } else {
      toast.error('Some chunks failed to upload!')
    }

    setIsLoadingUpload(false)
    setTimeout(() => {
      setIsUploadingDone(false)
      setProgressValue(0)
    }, 3000)
  }


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

    const defaultValueTahun = tahunName.find((item) => item.value === getCurrentYear().toString())
    const defaultValueBulan = bulanName.find((item) => item.value === (getCurrentMonth() + 1).toString())

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
        <Card>
            
          <CardHeader>
            <CardTitle>Upload Pengukuran Vegetatif</CardTitle>
            <div className="flex pt-5">
            <Select
            styles={customStyles}
              options={tahunName}
              className=''
              defaultValue={defaultValueTahun}
              onChange= {(e:any) => setTahun(e.value)}
 
            />

            <Select
            styles={customStyles}
                className='float-end ml-5'
              options={bulanName}
              defaultValue={defaultValueBulan} 
              onChange= {(e:any) => setBulan(e.value)}
            />
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                Upload file .csv atau .xlsx untuk menambahkan data Monitoring Vegetatif
              </p>
            </div>
            <div className='flex items-center justify-between'>
              <button
                className='flex cursor-pointer rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300'
                onClick={() => router('/download-template')}
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
                        <p className='text-sm text-gray-500 '>{fileName}</p>
                        <BsTrash
                          className='ml-2 cursor-pointer text-red-500'
                          onClick={handleRemoveFile}
                        />
                      </div>
                    ) : !fileName && loading ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100vh', // Full height of the viewport
                          flexDirection: 'column', // Stack items vertically
                        }}
                      >
                        <CircularProgress />
                        <Typography variant='h6' sx={{ marginTop: 2 }}>
                          Loading...
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
                {isLoadingUpload ? (
                  <div className='h-2.5 w-1/6 rounded-full bg-gray-200 '>
                    <div
                      className='animate-blink h-2.5 rounded-full bg-green-600 transition ease-in-out'
                      style={{ width: `${progressValue}%` }}
                    ></div>
                  </div>
                ) : null}

                {isUploadingDone ? (
                  <BsFillCheckCircleFill className='h-7 w-7 text-green-600' />
                ) : null}

                {!isLoadingUpload ? (
                  <button
                    onClick={() => handleUpload()}
                    disabled={!fileName || isLoadingUpload}
                    className='cursor-pointer rounded-full bg-green-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-not-allowed'
                  >
                    Upload File
                  </button>
                ) : null}
                <button className='cursor-pointer rounded-full bg-slate-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed'>
                  <Link to='/data-vegetatif'>Kembali</Link>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
