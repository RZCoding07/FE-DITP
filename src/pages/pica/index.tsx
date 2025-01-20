'use client'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.1'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Controller } from 'react-hook-form'
import { customStyles } from '@/styles/select-styles'
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
import slugify from 'slugify'
import Select from 'react-select'
import axios from 'axios'
import StockAnalysisChartBar from '@/components/custom/bar-chart'
import { fetchKebun } from '@/utils/api_immature'

export default function PicaTbm() {
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const [kebunOptions, setKebunOptions] = useState([])
  const [afdOptions, setAfdOptions] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [awal, setAwal] = useState([])

  const user = JSON.parse(cookie.get('user') || '{}')
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const router = useNavigate()

  const apiUrl = import.meta.env.VITE_API_IMMATURE
  const rpcOptions = [
    { value: 'RPC1', label: 'RPC 1' },
    { value: 'RPC2', label: 'RPC 2' },
    { value: 'RPC3', label: 'RPC 3' },
    { value: 'RPC4', label: 'RPC 4' },
    { value: 'RPC5', label: 'RPC 5' },
    { value: 'RPC6', label: 'RPC 6' },
    { value: 'RPC7', label: 'RPC 7' },
    { value: 'DATIM', label: 'DATIM' },
    { value: 'DJABA', label: 'DJABA' },
    { value: 'DSMTU', label: 'DSMTU' },
    { value: 'RPC2N2', label: 'RPC2N2' },
    { value: 'RPC2N14', label: 'RPC2N14' },
  ]

  const fetchInvesAwal = async () => {
    setLoading(true)
    const tahun = new Date().getFullYear()
    try {
      const response = await axios.get(`${apiUrl}/vegetatif`, {})
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
            <CardTitle>Monitoring Problem Idendification</CardTitle>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                PICA (Problem Identification & Corrective Action) Investasi
                Tanaman
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <StockAnalysisChartBar />
            <Tabs
              orientation='vertical'
              defaultValue='grafik'
              className='space-y-4'
            >
              <div className='w-full overflow-x-auto pb-2 text-center'>
                <TabsList>
                  {rpcOptions.map((rpc) => (
                    <TabsTrigger key={rpc.value} value={rpc.value}>
                      {rpc.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {rpcOptions.map((rpc) => (
                <TabsContent key={rpc.value} value={rpc.value}>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold flex align-middle items-center'>
                    <img width="30" height="30" src="https://img.icons8.com/stickers/30/problem-solving.png" alt="problem-solving"/>
                   &nbsp;    Data Masalah PICA {rpc.label}
                    </h2>
                    <div className='flex items-center space-x-2'>
                      <button className='flex items-center rounded-md bg-cyan-600 px-2 py-1 text-white'>
                        <FaFileExcel className='mr-1' />
                        Export Excel
                      </button>
                    </div>
                  </div>
                  <hr className='my-2 border-cyan-400' />
                  <div className='flex items-center space-x-2 float-end ml-5'>
                    <Controller
                      name='kebun'
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={customStyles}
                          placeholder='Filter by Kebun'
                          isSearchable
                          options={kebunOptions}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name='afd'
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={customStyles}
                          placeholder='Filter by Afdeling'
                          isSearchable
                          options={afdOptions}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div>
                    {loading ? (
                      <div className='flex h-full items-center justify-center'>
                        <CircularProgress />
                      </div>
                    ) : error ? (
                      <p>Error fetching Awal</p>
                    ) : (
                      <DataTable data={awal} columns={columns} />
                    )}
                    

                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
