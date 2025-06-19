import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { fetchDistinctYears, fetchDistinctYearsMonth } from '@/utils/api_immature'
import { MONTH_NAMES } from '@/utils/constants'
import { SelectOption } from '@/utils/types'

type KebunOption = SelectOption | null;

export const useDashboardForm = () => {
  const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
  const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
  const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
  const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      rpc: { value: 'all', label: 'Semua RPC' },
      kebun: null as KebunOption,
      afd: null,
      blok: { value: 'luasan', label: 'Luasan' },
      tahun: null,
      bulan: null,
    },
  })

  const rpc: any = watch('rpc')
  const kebun: KebunOption = watch('kebun')
  const afd: any = watch('afd')
  const blok: any = watch('blok')
  const bulan: any = watch('bulan')
  const tahun: any = watch('tahun')

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

  return {
    control,
    watch,
    setValue,
    errors,
    isSubmitting,
    bulanOptions,
    tahunOptions,
    defaultBulan,
    defaultTahun,
    rpc,
    kebun, // Sekarang kebun sudah bertipe KebunOption (SelectOption | null)
    afd,
    blok,
    bulan,
    tahun,
  }
}