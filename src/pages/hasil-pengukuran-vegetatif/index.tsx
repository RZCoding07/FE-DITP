import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Controller } from 'react-hook-form'
import { customStyles } from '@/styles/select-styles'
import { useState, useEffect } from 'react'
import cookie from 'js-cookie'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Select from 'react-select'
import { SelectOption } from '@/utils/types'
import { fetchVegetativeProc } from '@/utils/api_immature'
import ScatterChart from '@/components/custom/kuadran'
import { regionalKebunData } from '@/data/regional-kebun'
import { useNavigate } from 'react-router-dom'
import { fetchSerapanBiaya } from '@/utils/api_immature'
import { MONTH_NAMES } from '@/utils/constants'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import { Loading } from '@/components/ui/loading'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.1'
import axios from 'axios'
import { fetchDistinctYearsMonth, fetchKebun } from '@/utils/api_immature'
import { fetchDistinctYears } from '@/utils/api_immature'

import {
  getScoreJumlahPelepah,
  getScoreKerapatanPokok,
  getScoreLingkarBatang,
  getScoreTinggiTanaman,
  getColorJumlahPelepah,
  getColorLingkarBatang,
  getColorTinggiTanaman,
} from "@/components/custom/calculation-scores"
import {
  processScoreData,
  countColorCategories,
  sumLuasByColorCategory,
  processRegionalData,
} from "@/utils/dashboard-helper"
import { ColorTable } from '@/components/custom/color-table'
import MonthlyStatusTable from '@/components/custom/history-kuadran'

export default function Awal() {
  const [Awal, setAwal] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(cookie.get('user') || '{}')
  const account_type = user.account_type
  const fullname = user.fullname
  const regional = user.rpc
  const kebun = user.kebun

  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const router = useNavigate()

  const bulan: any = watch('bulan')
  const tahun: any = watch('tahun')
  const rpcVal = watch('rpc')
  const tbmVal = watch('tbm')
  const [hasInitialized, setHasInitialized] = useState(false) // Tambahkan flag inisialisasi

  const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
  const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
  const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
  const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)
  const [dataArealStatement, setArealStatement] = useState<any[]>([])

  const apiUrl = import.meta.env.VITE_API_IMMATURE

  useEffect(() => {
    const fetchBulanTahun = async () => {
      try {
        const data = await fetchDistinctYears()

        const tahun = data.map((item: any) => ({
          value: item.tahun,
          label: item.tahun.toString(),
        }))

        setTahunOptions(tahun)

        if (tahun.length > 0) {
          setDefaultTahun(tahun[0])
          setValue('tahun', tahun[0])
        }
      } catch (error) {
        console.error('Error fetching tahun:', error)
      }
    }

    if (!hasInitialized) {
      fetchBulanTahun()
      setHasInitialized(true)
    }
  }, [setValue, hasInitialized])

  useEffect(() => {
    const fetchBulan = async () => {
      if (!tahun) return

      try {
        const dataBulan = await fetchDistinctYearsMonth({
          tahun: tahun.value,
        })

        const bulan = dataBulan.map((item: any) => ({
          value: item.bulan,
          label: MONTH_NAMES[item.bulan - 1],
        }))

        setBulanOptions(bulan)

        if (bulan.length > 0) {
          setDefaultBulan(bulan[0])
          setValue('bulan', bulan[0])
        }
      } catch (error) {
        console.error('Error fetching bulan:', error)
      }
    }

    fetchBulan()
  }, [tahun, setValue])


  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/luas-areal-statement`)
      setArealStatement(response.data)
      setLoading(false)
    } catch (error: any) {
      setError(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const rpcOptions = [
    { value: 'RPC1', label: 'RPC 1' },
    { value: 'RPC2', label: 'RPC 2' },
    { value: 'RPC3', label: 'RPC 3' },
    { value: 'RPC4', label: 'RPC 4' },
    { value: 'RPC5', label: 'RPC 5' },
    { value: 'RPC6', label: 'RPC 6' },
    { value: 'RPC7', label: 'RPC 7' },
    { value: 'RPC2N2', label: 'RPC2N2' },
    { value: 'RPC2N14', label: 'RPC2N14' },
  ]
  const [serapanBiaya, setSerapanBiaya] = useState<any[]>([])
  const tbmOpt = [
    { value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' },
    { value: 'tbm1', label: 'TBM 1' },
    { value: 'tbm2', label: 'TBM 2' },
    { value: 'tbm3', label: 'TBM 3' },
  ]
  const [selectedRpc, setSelectedRpc] = useState<string | null>(null);
  const [selectedTbm, setSelectedTbm] = useState<string | null>(null);
  const [kebunOptions, setKebunOptions] = useState<{ value: string; label: string }[]>([])

  const handleRpcChange = (selectedOption: any) => {
    setSelectedRpc(selectedOption.value);
    const selectedRegional = regionalKebunData.regionals.find(
      (regional) => regional.name === selectedOption.value
    );
    setValue('kebun', null);
    setKebunOptions(
      selectedRegional ? selectedRegional.kebuns.map((kebun) => ({ value: kebun, label: kebun })) : []
    );
  };

  const handleTbmChange = (selectedOption: any) => {
    setSelectedTbm(selectedOption.value);
  }

  const [tbmData, setTbmData] = useState({
    tbm1: 0,
    tbm2: 0,
    tbm3: 0,
    tbm4: 0,
  })

  const [tbmDataScorePelepahBlok, setTbmDataScorePelepahBlok] = useState({
    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
  })

  const [tbmDataScoreLingkarBlok, setTbmDataScoreLingkarBlok] = useState({
    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
  })

  const [scores, setScores] = useState<any[]>([])
  const [scoresAll, setScoresAll] = useState<any[]>([])
  const [scoresRegional, setScoresRegional] = useState<any[]>([])
  const [scoresKebun, setScoresKebun] = useState<any[]>([])
  const [scoresKebunTBM, setScoresKebunTBM] = useState<any[]>([])
  const [tbmRes, setTbmRes] = useState<any[]>([])
  const [isKebun, setIsKebun] = useState<boolean>(false)
  const [isAfd, setIsAfd] = useState<boolean>(false)
  const [isTbm, setIsTbm] = useState<boolean>(true)
  const [regionalBlackBlockCount, setRegionalBlackBlockCount] = useState<any>({})
  const [colorData, setColorData] = useState({
    gold: 0,
    green: 0,
    red: 0,
    black: 0,
  })

  const [colorDataLuas, setColorDataLuas] = useState({
    gold: 0,
    green: 0,
    red: 0,
    black: 0,
  })

  const [colorDataDonat, setColorDataDonat] = useState({
    gold: 0,
    green: 0,
    red: 0,
    black: 0,
  })

  const [colorDataLuasDonat, setColorDataLuasDonat] = useState({
    gold: '',
    green: '',
    red: '',
    black: ''
  })


  const handleBulanChange = (selectedOption: any) => {
    setValue('bulan', selectedOption)
  }

  const handleReset = () => {
    setValue('rpc', null)
    setValue('tbm', { value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' })
  }

  // Main data fetching effect
  useEffect(() => {
    const fetchProcVegetatifDefault = async () => {
      try {
        // Reset all values to zero
        setTbmRes([])
        setScores([])
        setScoresKebun([])
        setScoresAll([])
        setColorData({
          black: 0,
          red: 0,
          green: 0,
          gold: 0,
        })
        setColorDataLuas({
          black: 0,
          red: 0,
          green: 0,
          gold: 0,
        })
        setTbmData({
          tbm1: 0,
          tbm2: 0,
          tbm3: 0,
          tbm4: 0,
        })
        setTbmDataScorePelepahBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        })
        setTbmDataScoreLingkarBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        })
        const loader = toast.loading(`Memuat data untuk Keseluruhan TBM...`, {
          duration: 20000,
        })


        const response = await fetchVegetativeProc({
          input_bulan: Number.parseInt(bulan.value),
          input_tahun: Number.parseInt(tahun.value),
        })

        // Group data by TBM phase
        const groupedData = response.data.reduce((acc: Record<string, any[]>, item: any) => {
          const tbmPhase = `tbm${item.vw_fase_tbm}`;
          if (!acc[tbmPhase]) {
            acc[tbmPhase] = [];
          }
          acc[tbmPhase].push(item);
          return acc;
        }, {});

        const tbmResults = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 };
        const scoreJumlahPelepahResults = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        };
        const scoreLingkarBatangResults = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        };
        const regionalBlackBlockCount: Record<string, any> = {};

        // Process each TBM phase
        Object.keys(groupedData).forEach((tbmPhase) => {
          const {
            newScores,
            newScoresKebun,
            newScoresRegional,
            newScoresAll,
            newRegionalBlackBlockCount,
            tbmResultsUpdate,
            scoreJumlahPelepahResultsUpdate,
            scoreLingkarBatangResultsUpdate,
          } = processScoreData({
            data: groupedData[tbmPhase],
            getScoreLingkarBatang,
            getScoreJumlahPelepah,
            getScoreTinggiTanaman,
            getScoreKerapatanPokok,
            getColorJumlahPelepah,
            getColorLingkarBatang,
            getColorTinggiTanaman,
          });

          setScores((prev) => [...prev, ...newScores]);
          setScoresAll((prev) => [...prev, ...newScoresAll]);
          setScoresKebun((prev) => [...prev, ...newScoresKebun]);
          setScoresRegional((prev) => [...prev, ...newScoresRegional]);

          // Update counts for this TBM phase
          regionalBlackBlockCount[tbmPhase] = newRegionalBlackBlockCount;
          Object.assign(tbmResults, tbmResultsUpdate);

          // Only update scores for TBM1-3
          if (['tbm1', 'tbm2', 'tbm3'].includes(tbmPhase)) {
            Object.assign(scoreJumlahPelepahResults[tbmPhase as keyof typeof scoreJumlahPelepahResults], scoreJumlahPelepahResultsUpdate);
            Object.assign(scoreLingkarBatangResults[tbmPhase as keyof typeof scoreLingkarBatangResults], scoreLingkarBatangResultsUpdate);
          }
        });

        setRegionalBlackBlockCount(regionalBlackBlockCount);
        setTbmData(tbmResults);
        setTbmDataScorePelepahBlok(scoreJumlahPelepahResults);
        setTbmDataScoreLingkarBlok(scoreLingkarBatangResults);


        toast.success("Seluruh data TBM berhasil ditampilkan!", {
          id: loader,
          duration: 2000,
        });
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Gagal memuat data TBM")
      }
    }
    setLoading(false)

    if (bulan && tahun) {
      fetchProcVegetatifDefault()
    }
  }, [bulan, tahun])

  // Process color data from scores
  useEffect(() => {
    if (scores.length === 0) return

    const data = scores.map((item) => {
      let key = Object.keys(item)[0]
      const data = item[key]
      if (key === "tbm4") {
        key = "TBM > 3"
      }
      return [
        key.toUpperCase(),
        data.regional,
        data.kebun,
        data.afdeling,
        data.blok,
        data.luas,
        data.jumPelepah,
        data.scoreLingkarBatang,
        data.scoreJumlahPelepah,
        data.scoreTinggiBatang,
        data.scoreKerapatanPokok,
        data.totalSeleksian,
        data.colorCategory,
      ]
    })

    // Calculate color data counts
    const colorData = data.reduce(
      (acc, item) => {
        const colorCategory = item[12] as keyof typeof acc
        if (colorCategory in acc) {
          acc[colorCategory] += 1
        } else {
          acc[colorCategory] = 1
        }
        return acc
      },
      { black: 0, red: 0, green: 0, gold: 0 },
    )

    // Calculate color data areas
    const colorDataLuas = data.reduce(
      (acc, item) => {
        const colorCategory = item[12] as keyof typeof acc
        const luas = item[5]
        if (colorCategory in acc) {
          acc[colorCategory] += luas
        } else {
          acc[colorCategory] = luas
        }
        return acc
      },
      { black: 0, red: 0, green: 0, gold: 0 },
    )

    setColorDataLuas(colorDataLuas)
    setColorData(colorData)
    setLoading(false)

  }, [scores])


  // Effect to filter scores based on kebun


  // State for filtered scores
  const [filteredScores, setFilteredScores] = useState<any[]>([]);

  useEffect(() => {
    setFilteredScores(scoresAll);

    console.log('Scores All:', scoresAll)

    // Periksa jika kebun ada dan tidak kosong
    if (regional && regional !== '' && kebun && kebun !== '') {
      // Filter by kebun jika ada
      const filtered = scoresAll.filter(score => score.kebun === kebun);
      setFilteredScores(filtered);
    } else if (regional && regional !== '' && !kebun || kebun == null) {
      // Jika kebun tidak ada, filter berdasarkan regional
      const filtered = scoresAll.filter(score => score.regional === regional);
      setFilteredScores(filtered);
    } else {
      // Jika tidak ada kebun atau regional, tampilkan semua data
      setFilteredScores(scoresAll);
    }

  }, [kebun, regional, scoresAll]);

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
        <div className='mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 px-5'>
          <div className='space-y-0.5'>
            {account_type === 'kebun' ? (
              <h2 className='text-2xl font-semibold tracking-tight'>
                Data Hasil Pengukuran Vegetatif Kebun {fullname}
              </h2>
            ) : account_type === 'regional' ? (
              <h2 className='text-2xl font-semibold tracking-tight'>
                Data Hasil Pengukuran Vegetatif {regional}
              </h2>
            ) : (
              <h2 className='text-2xl font-semibold tracking-tight'>
                Data Hasil Pengukuran Vegetatif
              </h2>
            )}
            <p className='text-muted-foreground'>
              Here&apos;s a list of Pengukuran Vegetatif in the system!
            </p>
          </div>
        </div>

        <div className='p-5 transition-shadow hover:shadow-lg bg-gradient-to-br rounded-lg justify-between dark:from-slate-950 bg-white dark:to-slate-900 lg:space-x-12 lg:space-y-0 mt-5'>
          <div className='gap-4'>
            <div className='grid grid-cols-7 gap-5'>
              <div className='col-span-2'>
                <label className='text-sm font-medium'>Pilih Tahun :</label>

                <Controller
                  name='tahun'
                  control={control}
                  defaultValue={defaultTahun}
                  render={({ field }) => (
                    <Select {...field} styles={customStyles} options={tahunOptions} />
                  )}
                />
              </div>
              <div className='col-span-2'>
                <label className='text-sm font-medium'>Pilih Bulan :</label>

                <Controller
                  name='bulan'
                  control={control}
                  defaultValue={defaultBulan}

                  render={({ field }) => (
                    <Select {...field}
                      styles={customStyles}
                      onChange={(selectedOption) => {
                        handleBulanChange(selectedOption);
                        field.onChange(selectedOption);
                      }}
                      options={bulanOptions} />
                  )}
                />
              </div>


            </div>
          </div>


        </div>
        <div className='rounded-lg bg-slate-50 bg-gradient-to-br px-5 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0 mt-5'>
          {loading ? (
            <div className=' items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable data={filteredScores} columns={columns} />
          )}


        </div>
        {/* <div className='rounded-lg mt-5 bg-slate-50 bg-gradient-to-br px-5 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>


          <div className='rounded-lg border border-cyan-500 bg-white p-3 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-cyan-700 dark:to-cyan-600 pt-5'>
            <ColorTable />
          </div>
        </div>
        <div className='rounded-lg mt-5 bg-slate-50 bg-gradient-to-br px-5 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>


          <div className='rounded-lg'>
            <MonthlyStatusTable />
          </div>
        </div> */}
      </Layout.Body>
    </Layout>
  )
}

