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

export default function UploadUser() {
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)


  const user = JSON.parse(cookie.get('user') || '{}')

  interface UploadData {
    regional: string;
    kebun: string;
    sumber_benih: string;
    jenis: string;
    varietas_dxp: string;
    umur_bulan: number | null;
    status: string | null;
    tanggal_penerimaan_kecambah: string | null; // Date in ISO format
    jumlah_penerimaan_kecambah: number | null;
    rafraksi: number | null;
    total_kecambah_diterima: number | null;
    seleksi_kks: number | null;
    seleksi_i_pn: number | null;
    seleksi_ii_pn: number | null;
    double_tone_pn: number | null;
    seleksi_i_mn: number | null;
    seleksi_ii_mn: number | null;
    seleksi_iii_mn: number | null;
    seleksi_angkut: number | null;
    sisa_bibit_setelah_seleksi: number | null;
    distribusi_tahun_sebelumnya: number | null;
    distribusi_bibit_2025: Record<string, number> | null;
    real_jumlah_distribusi: number | null;
    sisa_akhir_bibit: number | null;
    persen_seleksi_pn: number | null;
    persen_seleksi_mn: number | null;
    persen_total_seleksi: number | null;
    persen_double_tone: number | null;
    persen_bibit_siap_salur: number | null;
    jumlah_seleksi_pn: number | null;
    jumlah_seleksi_mn: number | null;
    jumlah_seleksi: number | null;
}


  const [mappedData, setMappedData] = useState<UploadData[]>([])
  const [values, setValues] = useState<any[]>([])
  const [fileName, setFileName] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bulan, setBulan] = useState()
  const [tahun, setTahun] = useState()

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
  const tahunName = [
    { value: 2021, label: '2021' },
    { value: 2022, label: '2022' },
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' },
    { value: 2025, label: '2025' },
    { value: 2026, label: '2026' },
    { value: 2027, label: '2027' },
    { value: 2028, label: '2028' },
    { value: 2029, label: '2029' },
    { value: 2030, label: '2030' },
    { value: 2031, label: '2031' },
    { value: 2032, label: '2032' },
    { value: 2033, label: '2033' },
    { value: 2034, label: '2034' },
  ]
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

            setValues(valuesArray.slice(2))
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
        const filteredValues = values.filter((value) => value[1] !== ''); // Filter nilai kosong

      const uploadData = async () => {
        const mappedDataPromises = filteredValues.map(async (value) => ({
            regional: value[0],
            kebun: value[1],
            sumber_benih: value[2],
            jenis: value[3],
            varietas_dxp: value[4],
            umur_bulan: value[5],
            status: value[6],   
            tanggal_penerimaan_kecambah: value[7],
            jumlah_penerimaan_kecambah: value[8],
            rafraksi: value[9],
            total_kecambah_diterima: value[10], // Diubah ke indeks 10
            seleksi_kks: value[11],
            seleksi_i_pn: value[12],
            seleksi_ii_pn: value[13],
            double_tone_pn: value[14],
            seleksi_i_mn: value[15],
            seleksi_ii_mn: value[16],
            seleksi_iii_mn: value[17],
            seleksi_angkut: value[18],
            sisa_bibit_setelah_seleksi: value[19],
            distribusi_tahun_sebelumnya: value[20],
            distribusi_bibit_2025: {
              tu: value[21],
              tbm_0: value[22],
              tbm_i: value[23],
              tbm_ii: value[24],
              tbm_iii: value[25],
              tbm_rehab: value[26],
              tm: value[27],
              lain_lain: value[28],
            },
            real_jumlah_distribusi: value[29],
            sisa_akhir_bibit: value[30],
            persen_seleksi_pn: value[31],
            persen_seleksi_mn: value[32],
            persen_total_seleksi: value[33],
            persen_double_tone: value[34],
            persen_bibit_siap_salur: value[35],
            jumlah_seleksi_pn: value[36],
            jumlah_seleksi_mn: value[37],
            jumlah_seleksi: value[38],
        }))
  
        const resolvedMappedData = await Promise.all(mappedDataPromises);
        setMappedData(resolvedMappedData);
      };
  
      uploadData();
    }
  }, [values]);
  
  const router = useNavigate()

  const handleUploadUsers = async () => {
    setIsLoadingUpload(true)

    const apiUrl = import.meta.env.VITE_API_NURSERY as string

    const chunkSize = Math.ceil(mappedData.length / 10)
    const uploadPromises = []

    for (let i = 0; i < 10; i++) {
      const chunk = mappedData.slice(i * chunkSize, (i + 1) * chunkSize)
      uploadPromises.push(
        fetch(`${apiUrl}/bibitan-upload`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
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
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (allSuccessful) {
      setIsUploadingDone(true)
      toast.success('All chunks uploaded successfully!')
    } else {
      toast.error('Some chunks failed to upload!')
    }

    setIsLoadingUpload(false)
    setTimeout(() => {
      setIsUploadingDone(false)
      setProgressValue(0)
    }, 3000)
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
        <Card>
          <CardHeader>
            <CardTitle>Upload Data Monitoring Nursery</CardTitle>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                Upload file .csv atau .xlsx untuk menambahkan data hasil seleksi
                bibitan
              </p>
            </div>
            <div className='flex items-center'>
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
                    onClick={() => handleUploadUsers()}
                    disabled={!fileName || isLoadingUpload}
                    className='cursor-pointer rounded-full bg-green-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-not-allowed'
                  >
                    Upload File
                  </button>
                ) : null}
                <button className='cursor-pointer rounded-full bg-slate-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed'>
                  <Link to='/nursery'>Kembali</Link>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
