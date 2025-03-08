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
export default function Awal() {
  const [Awal, setAwal] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(cookie.get('user') || '{}')
  const accountType = user.account_type

  const fullName = user.full_name

  const [rpc, setRpc] = useState<string | null>(null)
  const [kebun, setKebun] = useState<string | null>(null)

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

  const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
  const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
  const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
  const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)
  const [dataSerapanBiaya, setDataSerapanBiaya] = useState<any[]>([])

  const apiUrl = import.meta.env.VITE_API_IMMATURE

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
  const [afdOptions, setAfdOptions] = useState<{ value: string; label: string }[]>([])



  useEffect(() => {
    const fetchSerapanBiayaDis = async () => {
      const response = await fetch(`${apiUrl}/vegetatif-distinct-year`)
      const data = await response.json()
      const tahunOptions = data.map((item: any) => ({ value: item.tahun, label: item.tahun }))
      const bulanOptions = data.map((item: any) => ({ value: item.bulan, label: MONTH_NAMES[item.bulan - 1] }))
      setTahunOptions(tahunOptions)
      setBulanOptions(bulanOptions)
      setDefaultTahun(tahunOptions[0])
      setDefaultBulan(bulanOptions[0])
      setValue('tahun', tahunOptions[0])
      setValue('bulan', bulanOptions[0])
    }
    fetchSerapanBiayaDis()

  }, [])


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


  useEffect(() => {
    const fetchProcVegetatifDefault = async () => {
      try {
        setTbmRes([]);  // reset tbmRes array
        setScores([]);  // reset scores array
        setScoresKebun([]);  // reset scoresKebun array
        setColorData({
          black: 0,
          red: 0,
          green: 0,
          gold: 0,
        });  // reset colorData
        setColorDataLuas({
          black: 0,
          red: 0,
          green: 0,
          gold: 0,
        });  // reset colorDataLuas
        setTbmData({
          tbm1: 0,
          tbm2: 0,
          tbm3: 0,
          tbm4: 0,
        });  // reset tbmData
        setTbmDataScorePelepahBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        });  // reset tbmDataScorePelepahBlok
        setTbmDataScoreLingkarBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        });  // reset tbmDataScoreLingkarBlok

        const tbmResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const pokokSekarangResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const calJumlahPelepahResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const calLingkarBatangResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const avgPelepahResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const avgLingkarBatangResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const scoreLingkarBatangResults: {
          tbm1: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm2: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm3: {
            score100: number
            score90: number
            score80: number
            total: number
          }
        } = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        }

        const scoreJumlahPelepahResults: {
          tbm1: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm2: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm3: {
            score100: number
            score90: number
            score80: number
            total: number
          }
        } = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        }

        const loader = toast.loading(`Memuat data untuk Keseluruhan TBM...`, {
          duration: 20000,
        })

        let bulanValue = bulan.value
        let tahunValue = tahun.value

        for (let i = 1; i < 4; i++) {
          const tahunTanam = tahunValue - i;
          const response = await fetchVegetativeProc({
            input_tbm: 'tbm' + i,
            input_tahun_tanam: tahunTanam.toString(),
            input_bulan: parseInt(bulanValue),
            input_tahun: parseInt(tahunValue)
          });



          setTbmRes((prev) => [...prev, Object.values(response.data)]);

          const regionalBlackBlockCount: { [key: string]: number } = {};

          const newScores = Object.values(response.data).map((item: any) => {
            let age = bulanValue * i;
            if (age > 36) {
              age = 36;
            }
            const blok = item.blok;
            const scoreLingkarBatang =
              getScoreLingkarBatang(age, parseFloat(item.lingkar_batang_cm)) * 0.4;
            const scoreJumlahPelepah =
              getScoreJumlahPelepah(age, parseFloat(item.jumlah_pelepah_bh)) * 0.2;

            const scoreTinggiBatang =
              getScoreTinggiTanaman(age, parseFloat(item.tinggi_tanaman_cm)) * 0.1;

            const scoreKerapatanPokok =
              getScoreKerapatanPokok(
                age,
                parseFloat(item.jumlah_pokok_awal_tanam),
                parseFloat(item.jumlah_pokok_sekarang)
              ) * 0.3;

            const totalSeleksian =
              scoreLingkarBatang +
              scoreJumlahPelepah +
              scoreTinggiBatang +
              scoreKerapatanPokok;

            let colorCategory = '';

            if (totalSeleksian < 80) {
              colorCategory = 'black';
              const regional = item.regional;
              if (regionalBlackBlockCount[regional]) {
                regionalBlackBlockCount[regional] += 1;
              } else {
                regionalBlackBlockCount[regional] = 1;
              }
            } else if (totalSeleksian >= 80 && totalSeleksian < 90) {
              colorCategory = 'red';
            } else if (totalSeleksian >= 90 && totalSeleksian < 97) {
              colorCategory = 'green';
            } else if (totalSeleksian >= 97) {
              colorCategory = 'gold';
            }

            const luas = parseFloat(item.luas_ha);
            const regional = item.regional;
            const kebun = item.kebun;
            const lingkar = parseFloat(item.lingkar_batang_cm);
            const tinggi = parseFloat(item.tinggi_tanaman_cm);
            const jumPelepah = parseFloat(item.jumlah_pelepah_bh);

            setScores((prev) => [
              ...prev,
              {
                [`tbm${i}`]: {
                  id: item.id,
                  age: bulanValue * i,
                  tbm: 'tbm' + i,
                  regional,
                  kebun,
                  afdeling: item.afdeling,
                  blok,
                  scoreLingkarBatang,
                  scoreJumlahPelepah,
                  scoreTinggiBatang,
                  scoreKerapatanPokok,
                  totalSeleksian,
                  colorCategory,
                  luas,
                  jumPelepah,
                  lingkar,
                  tinggi,
                  a_jumlah_pokok_awal_tanam: parseFloat(item.jumlah_pokok_awal_tanam),
                  a_jumlah_pokok_sekarang: parseFloat(item.jumlah_pokok_sekarang),
                  a_tinggi_tanaman_cm: parseFloat(item.tinggi_tanaman_cm),
                  a_jumlah_pelepah_bh: parseFloat(item.jumlah_pelepah_bh),
                  a_lingkar_batang_cm: parseFloat(item.lingkar_batang_cm)
                },
              },
            ]);

            return {
              [`tbm${i}`]: {
                id: item.id,
                regional,
                blok,
                scoreLingkarBatang,
                scoreJumlahPelepah,
                scoreTinggiBatang,
                scoreKerapatanPokok,
                totalSeleksian,
                colorCategory,
                luas,
              },
            };
          });

          const newScoresPerKebun: { [key: string]: { regional: string; kebun: string; totalSeleksiKebun: number; totalLuas: number } } = {}

          Object.values(response.data).forEach((item: any) => {
            let age = bulanValue * i;
            if (age > 36) {
              age = 36;
            }
            const kebun = item.kebun;
            const regional = item.regional;
            const luas = parseFloat(item.luas_ha);

            const scoreLingkarBatang =
              getScoreLingkarBatang(age, parseFloat(item.lingkar_batang_cm)) * 0.4;
            const scoreJumlahPelepah =
              getScoreJumlahPelepah(age, parseFloat(item.jumlah_pelepah_bh)) * 0.2;
            const scoreTinggiBatang =
              getScoreTinggiTanaman(age, parseFloat(item.tinggi_tanaman_cm)) * 0.1;
            const scoreKerapatanPokok =
              getScoreKerapatanPokok(
                age,
                parseFloat(item.jumlah_pokok_awal_tanam),
                parseFloat(item.jumlah_pokok_sekarang)
              ) * 0.3;

            const totalSeleksian =
              scoreLingkarBatang +
              scoreJumlahPelepah +
              scoreTinggiBatang +
              scoreKerapatanPokok;

            if (!newScoresPerKebun[kebun]) {
              newScoresPerKebun[kebun] = {
                regional,
                kebun,
                totalSeleksiKebun: 0,
                totalLuas: 0,
              };
            }


            // Total seleksi dihitung berdasarkan luas (tertimbang)
            newScoresPerKebun[kebun].totalSeleksiKebun += totalSeleksian * luas;
            newScoresPerKebun[kebun].totalLuas += luas;
          });

          // Hitung rata-rata tertimbang total seleksi per kebun
          Object.keys(newScoresPerKebun).forEach((kebun) => {
            if (newScoresPerKebun[kebun].totalLuas > 0) {
              newScoresPerKebun[kebun].totalSeleksiKebun /= newScoresPerKebun[kebun].totalLuas;
            }

            setScoresKebun((prev) => [
              ...prev,
              {
                [`tbm${i}`]: {
                  regional: newScoresPerKebun[kebun].regional,
                  kebun,
                  luas: newScoresPerKebun[kebun].totalLuas,
                  totalSeleksiKebun: newScoresPerKebun[kebun].totalSeleksiKebun,
                  colorCategory: newScoresPerKebun[kebun].totalSeleksiKebun <= 80 ? 'black' : newScoresPerKebun[kebun].totalSeleksiKebun <= 89 ? 'red' : newScoresPerKebun[kebun].totalSeleksiKebun <= 96 ? 'green' : 'gold',
                },
              },

            ]);
          });

          const newScoresKebunTBM: {
            [key: string]: {
              regional: string
              kebun: string
              totalSeleksiKebun: number
              totalLuas: number
              weightedTotalSeleksi: number
            }
          } = {}

          // Calculate total area per kebun
          const totalLuasPerKebun: { [key: string]: number } = {}

          Object.values(scoresKebun).forEach((item) => {
            const key = Object.keys(item)[0] // Get key (e.g., 'tbm1')
            const kebunData = item[key]
            const kebun = kebunData.kebun
            const luas = kebunData.luas

            if (!totalLuasPerKebun[kebun]) {
              totalLuasPerKebun[kebun] = 0
            }

            totalLuasPerKebun[kebun] += luas
          })

          // Initialize newScoresKebunTBM with basic data
          Object.values(scoresKebun).forEach((item) => {
            const key = Object.keys(item)[0] // Get key (e.g., 'tbm1')
            const kebunData = item[key]
            const kebun = kebunData.kebun
            const regional = kebunData.regional
            const luas = kebunData.luas

            if (!newScoresKebunTBM[kebun]) {
              newScoresKebunTBM[kebun] = {
                regional,
                kebun,
                totalSeleksiKebun: 0,
                totalLuas: 0,
                weightedTotalSeleksi: 0,
              }
            }

            newScoresKebunTBM[kebun].totalLuas += luas
          })

          // Calculate weighted totalSeleksiKebun for each kebun
          Object.values(scoresKebun).forEach((item) => {
            const key = Object.keys(item)[0]
            const kebunData = item[key]
            const kebun = kebunData.kebun
            const luas = kebunData.luas
            const totalSeleksi = kebunData.totalSeleksiKebun

            // Calculate weighted contribution: (luas kebun in this tbm / total luas kebun across all tbm) * totalSeleksi
            const weightedContribution = (luas / totalLuasPerKebun[kebun]) * totalSeleksi

            // Add this weighted contribution to the total
            newScoresKebunTBM[kebun].totalSeleksiKebun += weightedContribution
          })

          // Round the values for better readability
          Object.keys(newScoresKebunTBM).forEach((kebun) => {
            newScoresKebunTBM[kebun].totalSeleksiKebun = Math.round(newScoresKebunTBM[kebun].totalSeleksiKebun * 100) / 100
          })


          setScoresKebunTBM(Object.values(newScoresKebunTBM))

          const newScoresRegional: { [key: string]: { regional: string; totalSeleksiRegional: number; totalLuas: number } } = {}

          Object.values(response.data).forEach((item: any) => {
            let age = bulan.value * i;
            if (age > 36) {
              age = 36;
            }
            const regional = item.regional;
            const luas = parseFloat(item.luas_ha);

            const scoreLingkarBatang =
              getScoreLingkarBatang(age, parseFloat(item.lingkar_batang_cm)) * 0.4;
            const scoreJumlahPelepah =
              getScoreJumlahPelepah(age, parseFloat(item.jumlah_pelepah_bh)) * 0.2;
            const scoreTinggiBatang =
              getScoreTinggiTanaman(age, parseFloat(item.tinggi_tanaman_cm)) * 0.1;
            const scoreKerapatanPokok =
              getScoreKerapatanPokok(
                age,
                parseFloat(item.jumlah_pokok_awal_tanam),
                parseFloat(item.jumlah_pokok_sekarang)
              ) * 0.3;

            const totalSeleksian =
              scoreLingkarBatang +
              scoreJumlahPelepah +
              scoreTinggiBatang +
              scoreKerapatanPokok;

            if (!newScoresRegional[regional]) {
              newScoresRegional[regional] = {
                regional,
                totalSeleksiRegional: 0,
                totalLuas: 0,
              };
            }
            newScoresRegional[regional].totalSeleksiRegional += totalSeleksian * luas;
            newScoresRegional[regional].totalLuas += luas;
          });

          Object.keys(newScoresRegional).forEach((regional) => {
            if (newScoresRegional[regional].totalLuas > 0) {
              newScoresRegional[regional].totalSeleksiRegional /= newScoresRegional[regional].totalLuas;
            }

            setScoresRegional((prev) => [
              ...prev,
              {
                [`tbm${i}`]: {
                  regional,
                  totalSeleksiRegional: newScoresRegional[regional].totalSeleksiRegional,
                },
              },
            ]);
          });

          // Rekap jumlah blok hitam per regional
          setRegionalBlackBlockCount((prev: any) => ({
            ...prev,
            [`tbm${i}`]: regionalBlackBlockCount,
          }));

          // Menghitung total luas dan pokok untuk rekap
          const totalLuasHa: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.luas_ha),
            0
          );

          const totalPokokSekarang: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.jumlah_pokok_sekarang),
            0
          );

          const totalCalJumlahPelepah: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.cal_jumlah_pelepah),
            0
          );

          const totalCalLingkarBatang: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.cal_lingkar_batang),
            0
          );

          tbmResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalLuasHa;

          pokokSekarangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalPokokSekarang;

          calJumlahPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalCalJumlahPelepah;

          calLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalCalLingkarBatang;

          avgPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalJumlahPelepah / totalPokokSekarang;

          avgLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalLingkarBatang / totalPokokSekarang;

          if (i < 4) {
            scoreJumlahPelepahResults[`tbm${i as 1 | 2 | 3}`] = {
              score100: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 100
              ).length,
              score90: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 90
              ).length,
              score80: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 80
              ).length,
              total: newScores.length,
            };

            scoreLingkarBatangResults[`tbm${i as 1 | 2 | 3}`] = {
              score100: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 100
              ).length,
              score90: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 90
              ).length,
              score80: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 80
              ).length,
              total: newScores.length,
            };
          }
        }

        setTbmData(tbmResults)
        setTbmDataScorePelepahBlok(scoreJumlahPelepahResults)
        setTbmDataScoreLingkarBlok(scoreLingkarBatangResults)
        toast.success('Seluruh data TBM berhasil ditampilkan!', {
          id: loader,
          duration: 2000,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    if (bulan && tahun) {
      fetchProcVegetatifDefault()

    }
  }, [defaultBulan, defaultTahun])


  const handleBulanChange = (selectedOption: any) => {
    setValue('bulan', selectedOption)
  }

  const handleReset = () => {
    setValue('rpc', null)
    setValue('tbm', { value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' })
  }


  useEffect(() => {
    if (scoresKebunTBM.length == 0) {
      handleBulanChange(defaultBulan)
    }
  }, [scoresKebunTBM])


  useEffect(() => {
    const data = scores.map((item) => {
      let key = Object.keys(item)[0];
      const data = item[key];
      if (key === 'tbm4') {
        key = 'TBM > 3';
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
      ];
    });

    const colorData = data.reduce((acc: any, item: any) => {
      const colorCategory = item[12];
      if (colorCategory in acc) {
        acc[colorCategory] += 1;
      } else {
        acc[colorCategory] = 1;
      }
      return acc;
    }, { black: 0, red: 0, green: 0, gold: 0 });

    const colorDataLuas = data.reduce((acc: any, item: any) => {
      const colorCategory = item[12];
      const luas = item[5]; // Ambil luas dari data
      if (colorCategory in acc) {
        acc[colorCategory] += luas;
      } else {
        acc[colorCategory] = luas;
      }
      return acc;
    }, { black: 0, red: 0, green: 0, gold: 0 });

    setColorDataLuas(colorDataLuas);
    setColorData(colorData);
  }, [scores]);

  // useEffect(() => {
  //   let z: any = []
  //   scores.filter((x: any) => {
  //     if (Object.keys(x).includes('tbm1')) {
  //       z.push(Object.values(x)[0])
  //     }
  //   })

  //   console.log(z)
  // }
  //   , [scores])
    
  useEffect(() => {
    let z: any = [];
    
    scores.forEach((x: any) => {
      Object.keys(x).forEach((key) => {
        if (key.startsWith("tbm")) {
          z.push(x[key]);
        }
      });
    });
  
    console.log(z);
  }, [scores]);
  

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
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Hasil Pengukuran Vegetatif

            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Pengukuran Vegetatif in the system!
            </p>
          </div>
          {/* {(account_type === 'HO PalmCo' || account_type === 'Superadmin' ) && ( */}
          <div className='ml-auto flex space-x-2'>
            <Link to='/upload-pengukuran-vegetatif'>
              <Button>Upload Data</Button>
            </Link>
          </div>
          {/* )} */}
        </div>

        <div className='flex-1 overflow-auto rounded-lg bg-slate-50 bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className=' flex gap-4'>
            <Controller
              name='tahun'
              control={control}
              defaultValue={defaultTahun}
              render={({ field }) => (
                <Select {...field} styles={customStyles} options={tahunOptions} />
              )}
            />

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

            <Controller
              name='rpc'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={customStyles}
                  placeholder='Pilih RPC'
                  isSearchable
                  options={rpcOptions}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleRpcChange(selectedOption);
                  }}
                />
              )}
            />

            <h2 className='text-lg mt-1 ml-5 mr-2'>Sort by : </h2>
            <Controller
              name='tbm'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={customStyles}
                  placeholder='Pilih TBM'
                  isSearchable
                  defaultValue={{ value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' }}
                  options={tbmOpt}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleTbmChange(selectedOption);
                  }}
                />
              )}
            />

            {/* reset button */}

            <Button
              className='rounded-full'
              onClick={() => {
                handleReset()
              }}
            >
              Reset
            </Button>

          </div>

          {/* {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable data={Awal} columns={columns} />
          )} */}
        </div>
      </Layout.Body>
    </Layout>
  )
}






function getScoreLingkarBatang(age: any, value: any) {
  // Input validation
  if (age < 1 || age > 36) {
    // console.log(age)
    return 0
  }

  const thresholds: any = {
    1: { score100: 51, score90: [46, 50], score80: 46 },
    2: { score100: 64, score90: [58, 63], score80: 58 },
    3: { score100: 77, score90: [69, 76], score80: 69 },
    4: { score100: 90, score90: [81, 89], score80: 81 },
    5: { score100: 103, score90: [93, 102], score80: 93 },
    6: { score100: 116, score90: [104, 115], score80: 104 },
    7: { score100: 122, score90: [109, 121], score80: 109 },
    8: { score100: 127, score90: [114, 126], score80: 114 },
    9: { score100: 133, score90: [120, 132], score80: 120 },
    10: { score100: 138, score90: [125, 137], score80: 125 },
    11: { score100: 144, score90: [130, 143], score80: 130 },
    12: { score100: 150, score90: [135, 149], score80: 135 },
    13: { score100: 157, score90: [141, 156], score80: 141 },
    14: { score100: 164, score90: [128, 163], score80: 128 },
    15: { score100: 171, score90: [154, 170], score80: 154 },
    16: { score100: 178, score90: [160, 177], score80: 160 },
    17: { score100: 185, score90: [167, 184], score80: 167 },
    18: { score100: 192, score90: [173, 191], score80: 173 },
    19: { score100: 199, score90: [179, 198], score80: 179 },
    20: { score100: 206, score90: [186, 205], score80: 186 },
    21: { score100: 214, score90: [192, 213], score80: 192 },
    22: { score100: 221, score90: [199, 220], score80: 199 },
    23: { score100: 228, score90: [205, 227], score80: 205 },
    24: { score100: 235, score90: [212, 234], score80: 212 },
    25: { score100: 242, score90: [218, 241], score80: 218 },
    26: { score100: 249, score90: [224, 228], score80: 224 },
    27: { score100: 256, score90: [230, 255], score80: 230 },
    28: { score100: 263, score90: [237, 262], score80: 237 },
    29: { score100: 270, score90: [243, 259], score80: 243 },
    30: { score100: 277, score90: [249, 276], score80: 249 },
    31: { score100: 277, score90: [271, 276], score80: 271 },
    32: { score100: 277, score90: [271, 276], score80: 271 },
    33: { score100: 277, score90: [271, 276], score80: 271 },
    34: { score100: 277, score90: [271, 276], score80: 271 },
    35: { score100: 277, score90: [271, 276], score80: 271 },
    36: { score100: 277, score90: [271, 276], score80: 271 },
  }

  if (value >= thresholds[age].score100) {
    return 100
  } else if (
    value >= thresholds[age].score90[0] &&
    value < thresholds[age].score100
  ) {
    return 90
  } else if (value < thresholds[age].score80) {
    return 80
  } else {
    return 0
  }
}

function getScoreJumlahPelepah(age: any, frondCount: any) {
  const frondThresholds: any = {
    1: { score100: 19, score90: 18, score80: 17 },
    2: { score100: 19, score90: 18, score80: 17 },
    3: { score100: 19, score90: 18, score80: 17 },
    4: { score100: 20, score90: 19, score80: 18 },
    5: { score100: 20, score90: 19, score80: 18 },
    6: { score100: 20, score90: 19, score80: 18 },
    7: { score100: 21, score90: 20, score80: 19 },
    8: { score100: 24, score90: 23, score80: 22 },
    9: { score100: 27, score90: 26, score80: 25 },
    10: { score100: 31, score90: 29, score80: 28 },
    11: { score100: 34, score90: 32, score80: 30 },
    12: { score100: 37, score90: 35, score80: 33 },
    13: { score100: 38, score90: 36, score80: 34 },
    14: { score100: 38, score90: 36, score80: 34 },
    15: { score100: 39, score90: 37, score80: 35 },
    16: { score100: 39, score90: 37, score80: 35 },
    17: { score100: 40, score90: 38, score80: 36 },
    18: { score100: 40, score90: 38, score80: 36 },
    19: { score100: 40, score90: 38, score80: 36 },
    20: { score100: 40, score90: 38, score80: 36 },
    21: { score100: 40, score90: 38, score80: 36 },
    22: { score100: 40, score90: 38, score80: 36 },
    23: { score100: 40, score90: 38, score80: 36 },
    24: { score100: 40, score90: 38, score80: 36 },
    25: { score100: 43, score90: 40, score80: 38 },
    26: { score100: 45, score90: 43, score80: 41 },
    27: { score100: 28, score90: 45, score80: 43 },
    28: { score100: 50, score90: 28, score80: 45 },
    29: { score100: 53, score90: 50, score80: 28 },
    30: { score100: 56, score90: 53, score80: 50 },
    31: { score100: 56, score90: 55, score80: 51 },
    32: { score100: 56, score90: 55, score80: 51 },
    33: { score100: 56, score90: 55, score80: 51 },
    34: { score100: 56, score90: 55, score80: 51 },
    35: { score100: 56, score90: 55, score80: 51 },
    36: { score100: 56, score90: 55, score80: 51 },
  }

  // Input validation
  if (age < 1 || age > 36) {
    return 0
  }

  const threshold = frondThresholds[age]

  if (frondCount >= threshold.score100) {
    return 100
  } else if (frondCount < threshold.score100 && frondCount >= threshold.score80) {
    return 90
  } else if (frondCount < threshold.score80) {
    return 80
  } else {
    return 0
  }
}

function getScoreTinggiTanaman(age: any, value: any) {
  const rulesTinggiTanaman: any = {
    '1': { min: 21, max: 21 },
    '2': { min: 23, max: 24 },
    '3': { min: 24, max: 27 },
    '4': { min: 26, max: 30 },
    '5': { min: 28, max: 33 },
    '6': { min: 30, max: 36 },
    '7': { min: 36, max: 41 },
    '8': { min: 43, max: 46 },
    '9': { min: 48, max: 51 },
    '10': { min: 53, max: 56 },
    '11': { min: 59, max: 63 },
    '12': { min: 64, max: 70 },
    '13': { min: 70, max: 74 },
    '14': { min: 76, max: 79 },
    '15': { min: 81, max: 83 },
    '16': { min: 86, max: 88 },
    '17': { min: 90, max: 93 },
    '18': { min: 95, max: 99 },
    '19': { min: 102, max: 105 },
    '20': { min: 108, max: 110 },
    '21': { min: 115, max: 116 },
    '22': { min: 121, max: 122 },
    '23': { min: 127, max: 128 },
    '24': { min: 133, max: 135 },
    '25': { min: 139, max: 140 },
    '26': { min: 144, max: 146 },
    '27': { min: 149, max: 153 },
    '28': { min: 154, max: 160 },
    '29': { min: 159, max: 166 },
    '30': { min: 164, max: 173 },
    '31': { min: 164, max: 173 },
    '32': { min: 164, max: 173 },
    '33': { min: 164, max: 173 },
    '34': { min: 164, max: 173 },
    '35': { min: 164, max: 173 },
    '36': { min: 164, max: 173 }
  };

  if (rulesTinggiTanaman[age]) {
    if (value < rulesTinggiTanaman[age].min) {
      return 80;
    } else if (value >= rulesTinggiTanaman[age].min && value < rulesTinggiTanaman[age].max) {
      return 90;
    } else if (value >= rulesTinggiTanaman[age].max) {
      return 100;
    }
  }

  return 0;
}

function getScoreKerapatanPokok(
  age: any,
  jum_pokok_awal: any,
  jum_pokok_akhir: any
) {
  let result = 0
  result = (jum_pokok_akhir / jum_pokok_awal) * 100
  if (result > 100) {
    return 100
  } else {
    return result
  }
}


