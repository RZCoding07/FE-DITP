import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import cookies from 'js-cookie'
import { Label } from '@/components/ui/label'
import cookie from 'js-cookie'

// // Define the schema for form validation
// const formSchema = z.object({
//   kode: z.string().min(1, { message: 'Kode investasi harus diisi!' }),
// })

// type FormValues = z.infer<typeof formSchema>

// // Define the type for the API response
// interface SearchResult {
//   // Add the expected properties of your API response here
//   // For example:
//   id: string
//   name: string
//   // ... other properties
//   kode?: string
//   namaInvestasi?: string
//   komoditas?: string
//   nilaiProyekTahunBerjalan?: number
//   no_pk?: string
// }

// interface SearchResultSPPBJ {
//   // Add the expected properties of your API response here
//   id: string
//   name: string
//   // ... other properties
//   no_pk?: string
//   judul_pk?: string
//   total_nilai?: number
//   value: number
//   tgl_create_pk?: string
//   tgl_submit_pk_ke_hps?: string
//   nilai_hps?: number
//   nama_panitia_hps?: string
//   tgl_submit_ke_pengadaan?: string
//   panitia_pelaksana_pengadaan?: string
//   status?: string
//   pengadaan_bersama?: string
//   sumber_dana?: string
//   sub_investasi?: string
//   peruntukan?: string
//   tahun_anggaran?: string
//   user_id?: string
//   createdAt?: string
//   updatedAt?: string
//   no_sppbj?: string
//   rpc_code?: string
// }

export default function SearchKodeInvestasi() {
  const theme = cookie.get('theme')
  // const [result, setResult] = useState<SearchResult[]>([])
  // const [resultSPPBJ, setResultSPPBJ] = useState<SearchResultSPPBJ[]>([])
  // const [searchTerm, setSearchTerm] = useState('')
  // const [selectedPKs, setSelectedPKs] = useState<string[]>([])
  // const [totalNilaiProyek, setTotalNilaiProyek] = useState(0)
  // const [nilaiProyek, setNilaiProyek] = useState([] as number[])
  // const [isSubmittingForm, setIsSubmitting] = useState(false)
  // const [pkDates, setPkDates] = useState<{
  //   [key: string]: { startDate: string; endDate: string }
  // }>({})
  // const [pkWeekOptions, setPkWeekOptions] = useState<{
  //   [key: string]: { value: string; label: string }[]
  // }>({})
  // const [weekPercentages, setWeekPercentages] = useState<{
  //   [key: string]: { [key: string]: number }
  // }>({})
  // const [isFormValid, setIsFormValid] = useState(false)

  // const getWeeksBetweenDates = (start: Date, end: Date) => {
  //   const weeks = []
  //   let currentDate = new Date(start)

  //   // Special case: Include the 1st day of the month in W1, even if it's not Saturday
  //   if (currentDate.getDate() === 1) {
  //     const weekStart = new Date(currentDate)
  //     let weekEnd = new Date(currentDate)
  //     weekEnd.setDate(weekEnd.getDate() + (5 - currentDate.getDay())) // Extend to Friday
  //     if (weekEnd.getMonth() !== weekStart.getMonth()) {
  //       weekEnd = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), 0)
  //     }
  //     weeks.push({
  //       start: weekStart,
  //       end: weekEnd,
  //     })
  //     currentDate.setDate(weekEnd.getDate() + 1) // Move to the next day
  //   }

  //   // Adjust start date to Saturday if it's not already
  //   if (currentDate.getDay() !== 6) {
  //     currentDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()))
  //   }

  //   while (currentDate <= end) {
  //     const weekStart = new Date(currentDate)
  //     let weekEnd = new Date(currentDate)
  //     weekEnd.setDate(weekEnd.getDate() + 6) // Friday

  //     // If week end is in the next month, set it to the last day of the current month
  //     if (weekEnd.getMonth() !== weekStart.getMonth()) {
  //       weekEnd = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), 0)
  //     }

  //     // Ensure week end doesn't exceed the overall end date
  //     if (weekEnd > end) {
  //       weekEnd = new Date(end)
  //     }

  //     weeks.push({
  //       start: weekStart,
  //       end: weekEnd,
  //     })

  //     // Move to the next week
  //     currentDate.setDate(currentDate.getDate() + 7)

  //     // If we're in a new month, reset to the 1st of that month
  //     if (currentDate.getMonth() !== weekStart.getMonth()) {
  //       currentDate = new Date(
  //         currentDate.getFullYear(),
  //         currentDate.getMonth(),
  //         1
  //       )
  //       // Adjust to Saturday if the 1st is not a Saturday
  //       if (currentDate.getDay() !== 6) {
  //         currentDate.setDate(
  //           currentDate.getDate() + (6 - currentDate.getDay())
  //         )
  //       }
  //     }
  //   }

  //   return weeks
  // }

  // // Format date as DD/MM/YYYY
  // const formatDate = (date: Date) => {
  //   return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  // }

  // useEffect(() => {
  //   Object.entries(pkDates).forEach(([pk, dates]) => {
  //     if (dates.startDate && dates.endDate) {
  //       const start = new Date(dates.startDate)
  //       const end = new Date(dates.endDate)

  //       if (start <= end) {
  //         const options = getWeeksBetweenDates(start, end)
  //         setPkWeekOptions((prev) => ({
  //           ...prev,
  //           [pk]: options.map((week, index) => ({
  //             value: `w${index + 1}`,
  //             label: `W${index + 1}: ${formatDate(week.start)} - ${formatDate(week.end)}`,
  //           })),
  //         }))
  //       } else {
  //         setPkWeekOptions((prev) => ({ ...prev, [pk]: [] }))
  //       }
  //     }
  //   })
  // }, [pkDates])

  // const form = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     kode: '',
  //   },
  // })

  // const { isSubmitting } = form.formState

  // const formatRupiah = (value: number) => {
  //   if (!value) return 'Rp. 0' // Jika nilai kosong atau null
  //   const numericValue = typeof value === 'number' ? value : parseFloat(value)
  //   if (isNaN(numericValue)) return 'Rp. 0' // Jika nilai bukan angka
  //   return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  // }

  // const user = cookies.get('user')
  // const rpc = user ? JSON.parse(user).rpc : ''

  // const handleSearch = async (kode: string) => {
  //   try {
  //     const apiUrl = import.meta.env.VITE_API_MONICA
  //     const response = await axios.post(
  //       `${apiUrl}/monica/getAllRecordsAwalWhereKodeInvestasi`,
  //       {
  //         kode: kode,
  //         regionalEditMapped: rpc,
  //       }
  //     )
  //     setResult(response.data)
  //     if (response.data.length === 0) {
  //       toast.error('Data Investasi di Regional Anda tidak ditemukan!')
  //     } else {
  //       toast.success('Data ditemukan!')
  //       toast.loading('Memuat data No PK Terbit SPPBJ')

  //       try {
  //         const apiUrl = import.meta.env.VITE_API_MONICA
  //         const response = await axios.post(
  //           `${apiUrl}/monica/getAllRecordsWhereVwSPPBJ`,
  //           {
  //             regionalEditMapped: rpc,
  //           }
  //         )
  //         setResultSPPBJ(response.data)
  //         if (response.data.length === 0) {
  //           toast.error('Data Investasi di Regional Anda tidak ditemukan!')
  //         } else {
  //           toast.success('Data No PK berhasil ditampilkan!')
  //         }
  //       } catch (error) {
  //         if (axios.isAxiosError(error)) {
  //           toast.error(error.response?.data?.message || 'Terjadi kesalahan!')
  //         } else {
  //           toast.error('Terjadi kesalahan yang tidak diketahui!')
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       toast.error(
  //         error.response?.data?.message || 'Terjadi kesalahan!' + error
  //       )
  //     } else {
  //       toast.error('Terjadi kesalahan yang tidak diketahui!')
  //     }
  //   }
  // }

  // const handleSearchSPPBJ = (term: string) => {
  //   setSearchTerm(term)
  // }

  // const handleReset = () => {
  //   setSearchTerm('')
  //   form.reset()
  //   setSelectedPKs([])
  //   setTotalNilaiProyek(0)
  //   setPkDates({})
  //   setPkWeekOptions({})
  //   setWeekPercentages({})
  //   setIsFormValid(false)
  //   setResultSPPBJ([])
  //   setNilaiProyek([])
  //   setTotalNilaiProyek(0)
  //   setResult([])
  // }

  // const handleCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   item: SearchResult
  // ) => {
  //   const pk = item.no_pk

  //   if (event.target.checked) {
  //     setSelectedPKs([...selectedPKs, pk!])
  //     setPkDates((prev) => ({ ...prev, [pk!]: { startDate: '', endDate: '' } }))
  //     const res = resultSPPBJ.find((resItem) => resItem.no_pk === pk)
  //     if (res) {
  //       const value = res.value || 0 // Default to 0 if value is null or undefined
  //       setNilaiProyek((prev) => [...prev, value])
  //     }
  //   } else {
  //     setSelectedPKs(selectedPKs.filter((selectedPk) => selectedPk !== pk))
  //     setPkDates((prev) => {
  //       const newPkDates = { ...prev }
  //       delete newPkDates[pk!]
  //       return newPkDates
  //     })
  //     setPkWeekOptions((prev) => {
  //       const newPkWeekOptions = { ...prev }
  //       delete newPkWeekOptions[pk!]
  //       return newPkWeekOptions
  //     })
  //     setWeekPercentages((prev) => {
  //       const newWeekPercentages = { ...prev }
  //       delete newWeekPercentages[pk!]
  //       return newWeekPercentages
  //     })
  //     const res = resultSPPBJ.find((resItem) => resItem.no_pk === pk)
  //     if (res) {
  //       const value = res.value || 0 // Default to 0 if value is null or undefined
  //       setNilaiProyek((prev) => prev.filter((v) => v !== value))
  //     }
  //   }
  // }

  // const handleDateChange = (
  //   pk: string,
  //   dateType: 'startDate' | 'endDate',
  //   value: string
  // ) => {
  //   setPkDates((prev) => ({
  //     ...prev,
  //     [pk]: { ...prev[pk], [dateType]: value },
  //   }))
  // }

  // const handlePercentageChange = (pk: string, week: string, value: string) => {
  //   const numValue = parseInt(value, 10)
  //   if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
  //     setWeekPercentages((prev) => ({
  //       ...prev,
  //       [pk]: {
  //         ...prev[pk],
  //         [week]: numValue,
  //       },
  //     }))
  //   } else {
  //     // If the input is invalid, set it to 0 or remove it
  //     setWeekPercentages((prev) => ({
  //       ...prev,
  //       [pk]: {
  //         ...prev[pk],
  //         [week]: 0,
  //       },
  //     }))
  //   }
  // }

  // const handleAllSubmit = async () => {
  //   const data = {
  //     selectedPKs,
  //     pkDates,
  //     weekPercentages,
  //     rpc,
  //   }

  //   console.log(data)
  // }

  // useEffect(() => {
  //   const total = nilaiProyek.reduce((sum, current) => sum + Number(current), 0)
  //   setTotalNilaiProyek(total)
  //   const totalNilaiProyekBerjalan = result.reduce(
  //     (sum, item: any) => sum + (item.nilaiProyekTahunBerjalan || 0),
  //     0
  //   )
  //   console.log(totalNilaiProyekBerjalan)
  //   if (total > totalNilaiProyekBerjalan) {
  //     toast.error('Total Nilai Proyek melebihi Nilai Proyek Tahun Berjalan!')
  //     setIsSubmitting(false)
  //   } else if (total === 0) {
  //     setIsSubmitting(false)
  //   } else {
  //     setIsSubmitting(true)
  //   }

  //   // Validate form
  //   let isValid = true

  //   // Check if any PK is selected
  //   if (selectedPKs.length === 0) {
  //     isValid = false
  //   }

  //   // Check if all selected PKs have start and end dates
  //   selectedPKs.forEach((pk) => {
  //     if (!pkDates[pk] || !pkDates[pk].startDate || !pkDates[pk].endDate) {
  //       isValid = false
  //     }
  //   })

  //   // Check if all weekly percentages are filled and sum up to 100%
  //   Object.entries(weekPercentages).forEach(([pk, percentages]) => {
  //     const totalPercentage = Object.values(percentages).reduce(
  //       (sum, val) => sum + val,
  //       0
  //     )
  //     if (
  //       totalPercentage !== 100 ||
  //       Object.keys(percentages).length !== pkWeekOptions[pk]?.length
  //     ) {
  //       isValid = false
  //     }
  //   })

  //   setIsFormValid(isValid)
  // }, [
  //   nilaiProyek,
  //   result,
  //   weekPercentages,
  //   pkWeekOptions,
  //   selectedPKs,
  //   pkDates,
  // ])

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
        {/* <Card>
          <CardHeader>
            <CardTitle>Input Paket Pekerjaan</CardTitle>
            <CardDescription>
              Masukkan kode investasi untuk mencari data terkait.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className='space-y-4'
                onSubmit={form.handleSubmit((data) => handleSearch(data.kode))}
              >
                <FormField
                  control={form.control}
                  name='kode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Investasi (SINUSA)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Masukkan kode investasi'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Memuat data...' : 'Cari Kode Investasi'}
                </Button>
                <Button className='float-end' onClick={handleReset}>
                  Reset
                </Button>
              </form>
            </Form>
            <div className='mt-4'>
              <h4 className='font-bold'>Hasil Pencarian:</h4>
              <ul className='list-none p-0'>
                {result.map((item: any) => (
                  <li key={item.id} className='border-b py-2'>
                    <div className='flex'>
                      <span className='w-1/4 font-medium'>Kode Investasi</span>
                      <span className='w-3/4'>: {item.kode}</span>
                    </div>
                    <div className='flex'>
                      <span className='w-1/4 font-medium'>Nama Investasi</span>
                      <span className='w-3/4'>: {item.namaInvestasi}</span>
                    </div>
                    <div className='flex'>
                      <span className='w-1/4 font-medium'>Komoditas:</span>
                      <span className='w-3/4'>: {item.komoditas}</span>
                    </div>
                    <div className='flex'>
                      <span className='w-1/4 font-medium'>
                        Nilai Proyek Tahun Berjalan:
                      </span>
                      <span className='w-3/4'>
                        : {formatRupiah(item.nilaiProyekTahunBerjalan)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='grid grid-cols-[30%_70%]'>
                <h4 className='py-2 font-bold'>STEP-1 (Pilih No PK)</h4>
                <h4 className='ml-5 py-2 font-bold'>
                  STEP-2 (Input Rencana Progress Weekly Timeline)
                </h4>
              </div>
              <div className='grid grid-cols-[30%_70%]'>
                <div className='border px-5 py-2'>
                  <div className=''>
                    <h4 className='py-2 font-bold'>Pilih No PK :</h4>
                    <div className='flex space-x-2 py-2'>
                      <Input
                        placeholder='Cari Nomor Paket Pekerjaan'
                        value={searchTerm}
                        onChange={(e) => handleSearchSPPBJ(e.target.value)}
                      />
                    </div>
                    <ul className='list-none p-0'>
                      {resultSPPBJ.map((item: any) => (
                        <li
                          key={item.id}
                          className='border-b py-2'
                          style={{
                            display:
                              searchTerm === '' ||
                              item.no_pk
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase())
                                ? 'block'
                                : 'none',
                          }}
                        >
                          <input
                            type='checkbox'
                            id={item.id}
                            name={item.id}
                            checked={selectedPKs.includes(item.no_pk || '')}
                            onChange={(e) => handleCheckboxChange(e, item)}
                          />
                          <label htmlFor={item.id}>&nbsp; {item.no_pk}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className='ml-5 border py-2 pl-5'>
                  <div className='px-5 pt-2'>
                    <Button
                      className='float-end'
                      disabled={!isFormValid || !isSubmittingForm}
                      onClick={() => handleAllSubmit()}
                    >
                      Submit
                    </Button>
                  </div>
                  <h4 className='py-2 font-bold'>
                    Total Nilai Proyek: {formatRupiah(totalNilaiProyek)}
                  </h4>
                  <h4 className='pb-0 pt-2 font-bold'>No PK Yang Dipilih:</h4>
                  <ul className='list-none'>
                    {selectedPKs.map((pk) => (
                      <li
                        key={pk}
                        className='my-5 mr-5 border border-b px-3 py-3 shadow-lg'
                      >
                        <span className='font-bold'>{pk}</span>
                        <div className='flex'>
                          <span className='w-1/4 font-medium'>
                            Judul Pekerjaan
                          </span>
                          <span className='w-3/4'>
                            :{' '}
                            {
                              resultSPPBJ.find((item) => item.no_pk === pk)
                                ?.judul_pk
                            }
                          </span>
                        </div>
                        <div className='mb-2 flex'>
                          <span className='w-1/4 font-medium'>Total Nilai</span>
                          <span className='w-3/4'>
                            :{' '}
                            {formatRupiah(
                              resultSPPBJ.find((item) => item.no_pk === pk)
                                ?.value || 0
                            )}
                          </span>
                        </div>
                        <div className=''>
                          <h1 className='mb-4 text-lg font-bold'>
                            Pilih Rentang Tanggal
                          </h1>
                          <div className='space-y-4'>
                            <div>
                              <Label
                                htmlFor={`startDate-${pk}`}
                                className='mb-2'
                              >
                                Tanggal Mulai:
                              </Label>
                              <Input
                                type='date'
                                id={`startDate-${pk}`}
                                value={pkDates[pk]?.startDate || ''}
                                onChange={(e) =>
                                  handleDateChange(
                                    pk,
                                    'startDate',
                                    e.target.value
                                  )
                                }
                                style={{
                                  colorScheme:
                                    theme === 'dark' ? 'dark' : 'light',
                                }}
                                className='w-full'
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`endDate-${pk}`} className='mb-2'>
                                Tanggal Selesai:
                              </Label>
                              <Input
                                type='date'
                                id={`endDate-${pk}`}
                                value={pkDates[pk]?.endDate || ''}
                                onChange={(e) =>
                                  handleDateChange(
                                    pk,
                                    'endDate',
                                    e.target.value
                                  )
                                }
                                style={{
                                  colorScheme:
                                    theme === 'dark' ? 'dark' : 'light',
                                }}
                                className='w-full'
                                required
                              />
                            </div>
                          </div>
                          <div className='mb-4 flex'>
                            <small>
                              *Pastikan tanggal yang dimasukkan sudah benar
                            </small>
                          </div>
                          <CardDescription>
                            Apakah No PK ini akan digabungkan dengan Kode
                            Investasi yang lain? Jika iya, silahkan ubah Total Nilai Proyek dibawah ini 
                            <div className='grid grid-cols-2 align-middle justify-center'>
                              <div className=''>
                                <Input
                                  type='number'
                                  id='sumberDana'
                                  className='w-full'
                                  defaultValue={resultSPPBJ.find( (item) => item.no_pk === pk)?.value} 
                                  required
                                />
                                <small>Masukkan Total Nilai untuk Investasi ini:</small>

                              </div>
                            </div>
                          </CardDescription>
                          <div className='my-4 flex'>
                            <small>
                              *Pastikan Rencana Weekly Timeline 100% agar bisa
                              di submit
                            </small>
                          </div>

                          <div className='flex'>
                            <div className='w-2/4 font-medium'>
                              <h2 className='mb-2 text-lg font-semibold'>
                                Minggu yang Dihasilkan:
                              </h2>
                            </div>
                            <div className='w-2/4'>
                              <h2 className='mb-2 text-lg font-semibold'>
                                Rencana Weekly Timeline ( % )
                              </h2>
                            </div>
                          </div>
                          <ul className='list-none'>
                            {pkWeekOptions[pk]?.map((week) => (
                              <li
                                key={week.value}
                                className='allign-middle justify-center'
                              >
                                <div className='allign-middle flex justify-center border-b py-1'>
                                  <span className='w-2/4 font-medium'>
                                    {week.label}
                                  </span>
                                  <span className='w-2/4'>
                                    <Input
                                      id={`percentage-${pk}-${week.value}`}
                                      type='number'
                                      className='w-full'
                                      min={0}
                                      max={100}
                                      onChange={(e) =>
                                        handlePercentageChange(
                                          pk,
                                          week.value,
                                          e.target.value
                                        )
                                      }
                                      value={
                                        weekPercentages[pk]?.[week.value] || ''
                                      }
                                      required
                                    />
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </Layout.Body>
    </Layout>
  )
}
