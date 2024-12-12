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

export default function UploadUser() {
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const user = JSON.parse(cookie.get('user') || '{}')

  interface UploadData {
    regionalEdit: string
    kode: string
    tahun: string
    unit: string
    parent: string
    rekeningBesar: string
    kuadran: string
    rekeningKecil: string
    onFarmOffFarm: string
    item: string
    komoditas: string
    kategoriBisnisInvestasi: string
    sumberPendanaan: string
    jenisInvestasi: string
    namaInvestasi: string
    programStrategisNasional: string
    carryOver: string
    watchlistNonWatchlist: string
    tanggalAwalInvestasi: string
    tanggalAkhirInvestasi: string
    periodeInvestasi: string
    jumlahTahun: string
    jumlahTotalFisikInvestasi: string
    satuan: string
    nilaiProyekTahunSebelumnya: string
    nilaiProyekTahunBerjalan: string
    jumlahFisikTahunBerjalan: string
    nilaiProyekT1: string
    nilaiProyekT2: string
    nilaiProyekT3: string
    nilaiProyekT4: string
    nilaiProyekT5: string
    nilaiProyekGreaterT5: string
    totalNilaiProyekInvestasi: string
    hargaSatuan: string
    strategisNonStrategis: string
    irr: string
    npv: string
    paybackPeriod: string
    profitabilityIndex: string
    tujuanPengajuanInvestasi: string
    kodeWbsSap: string
    costCenterSap: string
    luasArealTanam: string
    jarakTanam: string
    tanamanKonversiEks: string
    namaKlonVarietas: string
    tahunTanam: string
    usiaTanaman: string
    populasiTanamanPelindung: string
    stasiunPabrik: string
    statusUsulan: string
    regional: string
    divisiTeknisSubHolding: string
    divisiTeknisHolding: string
    user_id: string
  }

  const [mappedData, setMappedData] = useState<UploadData[]>([])
  const [values, setValues] = useState<any[]>([])
  const [fileName, setFileName] = useState(null)
  const [loading, setLoading] = useState(false)

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
  }, [values])  // Add this line

  
  useEffect(() => {
    if (values.length > 0) {
        const mapped = values.map((value) => ({
            regionalEdit: value[0],
            kode: value[1],
            tahun: value[2],
            unit: value[3],
            parent: value[4],
            rekeningBesar: value[5],
            kuadran: value[6],
            rekeningKecil: value[7],
            onFarmOffFarm: value[8],
            item: value[9],
            komoditas: value[10],
            kategoriBisnisInvestasi: value[11],
            sumberPendanaan: value[12],
            jenisInvestasi: value[13],
            namaInvestasi: value[14],
            programStrategisNasional: value[15],
            carryOver: value[16],
            watchlistNonWatchlist: value[17],
            tanggalAwalInvestasi: value[18],
            tanggalAkhirInvestasi: value[19],
            periodeInvestasi: value[20],
            jumlahTahun: value[21],
            jumlahTotalFisikInvestasi: value[22],
            satuan: value[23],
            nilaiProyekTahunSebelumnya: value[24],
            nilaiProyekTahunBerjalan: value[25],
            jumlahFisikTahunBerjalan: value[26],
            nilaiProyekT1: value[27],
            nilaiProyekT2: value[28],
            nilaiProyekT3: value[29],
            nilaiProyekT4: value[30],
            nilaiProyekT5: value[31],
            nilaiProyekGreaterT5: value[32],
            totalNilaiProyekInvestasi: value[33],
            hargaSatuan: value[34],
            strategisNonStrategis: value[35],
            irr: value[36],
            npv: value[37],
            paybackPeriod: value[38],
            profitabilityIndex: value[39],
            tujuanPengajuanInvestasi: value[40],
            kodeWbsSap: value[41],
            costCenterSap: value[42],
            luasArealTanam: value[43],
            jarakTanam: value[44],
            tanamanKonversiEks: value[45],
            namaKlonVarietas: value[46],
            tahunTanam: value[47],
            usiaTanaman: value[48],
            populasiTanamanPelindung: value[49],
            stasiunPabrik: value[50],
            statusUsulan: value[51],
            regional: value[52],
            divisiTeknisSubHolding: value[53],
            divisiTeknisHolding: value[54],
            user_id: user.id
        }));
        

        setMappedData(mapped);
        console.log(mapped); // Log mappedData here
    }
}, [values]);

  const router = useNavigate()

  const apiUrl = import.meta.env.VITE_API_MONICA

  const handleUpload = async (): Promise<void> => {
    setIsLoadingUpload(true);
    // const loginData = cookie.get("token");
    // const tokenData = JSON.parse(loginData || "{}");

    const chunkSize = Math.ceil(mappedData.length / 10);
    const uploadPromises = [];
    
    for (let i = 0; i < 10; i++) {
        const chunk = mappedData.slice(i * chunkSize, (i + 1) * chunkSize);
        uploadPromises.push(
            fetch(`${apiUrl}/monica/uploadAwal`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${tokenData.payload.access_token}`,
                },
                body: JSON.stringify({
                    mappedData: chunk
                }),
            }).then((res) => res.json())
        );
    }

    const results = await Promise.all(uploadPromises);

    const allSuccessful = results.every(result => result.status_code === 200);

    const totalBatches = 10;
    for (let i = 0; i < totalBatches; i++) {
        const progressPercent = ((i + 1) * 100) / totalBatches;
        setProgressValue(progressPercent);
        await new Promise((resolve) => setTimeout(resolve, 10));
    }

    if (allSuccessful) {
        setIsUploadingDone(true);
    } else {
        toast.error("Some chunks failed to upload!");
    }

    setIsLoadingUpload(false);
    setTimeout(() => {
        setIsUploadingDone(false);
        setProgressValue(0);
    }, 3000);

};

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
            <CardTitle>Upload Investasi Awal (SINUSA)</CardTitle>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                Upload file .csv atau .xlsx untuk menambahkan data investasi awal SINUSA
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
                  <Link to='/investasi-awal'>Kembali</Link>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
