import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { fetchDistinctYears } from '@/utils/api_immature'
import { MONTH_NAMES } from '@/utils/constants'
import { SelectOption } from '@/utils/types'

export const useDashboardForm = () => {
  const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
  const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
  const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
  const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)

  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      rpc: { value: 'all', label: 'Semua RPC' },
      kebun: null,
      afd: null,
      blok: { value: 'luasan', label: 'Luasan' },
      tahun: null,
      bulan: null,
    },
  })

  const rpc: any = watch('rpc')
  const kebun: any = watch('kebun')
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

        const bulan = data.map((item: any) => ({
          value: item.bulan,
          label: MONTH_NAMES[parseInt(item.bulan) - 1],
        }))

        setTahunOptions(tahun)
        setBulanOptions(bulan)

        if (tahun.length > 0) {
          setDefaultTahun(tahun[0])
          setValue('tahun', tahun[0])
        }
        if (bulan.length > 0) {
          setDefaultBulan(bulan[0])
          setValue('bulan', bulan[0])
        }
      } catch (error) {
        console.error('Error fetching stok awal:', error)
      }
    }

    fetchBulanTahun()
  }, [setValue])

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
    kebun,
    afd,
    blok,
    bulan,
    tahun,
  }
}
