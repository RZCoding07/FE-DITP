"use client"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme-switch"
import { UserNav } from "@/components/user-nav"
import { useState, useEffect } from "react"
import cookie from "js-cookie"
import Papa from "papaparse"
import { BsFillCheckCircleFill, BsTrash, BsExclamationCircle } from "react-icons/bs"
import readXlsxFile from "read-excel-file"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, CircularProgress, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import Select from "react-select"
import axios from "axios"

interface UploadData {
  regional: string
  kebun: string
  afdeling: string
  blok: string
  luas_ha: number
  varietas: string
  fase_tbm: string
  bulan_tanam: string
  tahun_tanam: string
  umur_saat_ini_bulan: string
  jumlah_pokok_awal_tanam: string
  pkk_ha_awal_tanam: string
  jumlah_pokok_sekarang: string
  pkk_ha_saat_ini: string
  lingkar_batang_cm: string
  tinggi_tanaman_cm: string
  jumlah_pelepah_bh: string
  panjang_rachis_cm: string
  tebal_petiola_cm: string
  lebar_petiola_cm: string
  jumlah_anak_daun: string
  rerata_panjang_anak_daun: string
  rerata_lebar_anak_daun: string
  jumlah_pokok_sampel: string
  tanggal_pengamatan: string
  tahun: number
  bulan: number
  user_id: string
}

interface ArealData {
  tahun_tanam: number
  rpc: string
  kebun: string
  luas_ha: number
}

export default function UploadVegetatif() {
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [hasEmptyFields, setHasEmptyFields] = useState(false)
  const [arealData, setArealData] = useState<ArealData[]>([])
  const [areaValidationError, setAreaValidationError] = useState<string | null>(null)
  const [selectedYears, setSelectedYears] = useState<number[]>([])

  const user = JSON.parse(cookie.get("user") || "{}")
  const userId = user.id
  const rpc = user.rpc
  const kebun = user.kebun

  const [mappedData, setMappedData] = useState<UploadData[]>([])
  const [values, setValues] = useState<any[]>([])
  const [fileName, setFileName] = useState(null)
  const [loading, setLoading] = useState(false)

  const [bulan, setBulan] = useState(4)
  const [tahun, setTahun] = useState(new Date().getFullYear())

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

  // Fetch areal data on component mount
  useEffect(() => {
    const fetchArealData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/areal-tbm-master`, {
          rpc: rpc,
          kebun: kebun,
          tahun: tahun
        })
        setArealData(response.data.data)
      } catch (error) {
        console.error("Error fetching areal data:", error)
        toast.error("Gagal memuat data areal kebun")
      }
    }

    fetchArealData()
  }, [rpc, kebun])

  const handleDrop = async (event: any) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      await parseFile(file)
    }
  }

  // Add this function to validate varietas
  const isValidVarietas = (varietas: string): boolean => {
    const validVarietas = [
      "dp yangambi",
      "dp ppks 718",
      "dp 239",
      "dp langkat",
      "dp simalungun",
      "dp avros",
      "dp 540",
      "lonsum",
      "dami mas",
      "bina sawit makmur",
      "sarana inti pratama",
      "panca surya garden",
      "sf lame",
      "sf mtg",
      "sf yangambi",
      "bakrie",
      "topaz",
      "sriwijaya sampoerna",
      "verdant",
    ]
    return validVarietas.includes(varietas.toLowerCase())
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
    setShowPreview(false)
    setAreaValidationError(null)
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    try {
      if (fileExtension === "csv") {
        Papa.parse(file, {
          skipEmptyLines: true,
          complete: (results) => {
            const rowsArray = []
            const valuesArray: any[] = []

            results.data.forEach((d: any) => {
              rowsArray.push(Object.keys(d))
              valuesArray.push(Object.values(d))
            })

            // Filter rows based on selected years if any are selected
            const filteredValues =
              selectedYears.length > 0
                ? valuesArray.slice(1).filter((row) => selectedYears.includes(Number.parseInt(row[6])))
                : valuesArray.slice(1)

            setValues(filteredValues)
            setFileName(file.name)
          },
        })
      } else if (fileExtension === "xlsx") {
        const results = await readXlsxFile(file)
        const rowsArray = []
        const valuesArray: any[] = []

        results.forEach((row) => {
          const rowValues = row.map((cell) => (cell !== null ? cell.toString() : ""))
          rowsArray.push(rowValues)
          valuesArray.push(rowValues)
        })

        // Filter rows based on selected years if any are selected
        const filteredValues =
          selectedYears.length > 0
            ? valuesArray.slice(1).filter((row) => selectedYears.includes(Number.parseInt(row[6])))
            : valuesArray.slice(1)

        setValues(filteredValues)
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
    setShowPreview(false)
    setValidationErrors([])
    setHasEmptyFields(false)
    setAreaValidationError(null)
    setSelectedYears([]) // Reset selected years when file is removed
  }

  // Validate total area against areal data
  const validateTotalArea = (mappedData: UploadData[]) => {
    if (arealData.length === 0) {
      setAreaValidationError("Data areal kebun belum dimuat")
      return false
    }

    // Group uploaded data by tahun_tanam and sum luas_ha
    const uploadedAreas: Record<string, number> = {}

    mappedData.forEach((row) => {
      const tahunTanam = row.tahun_tanam
      const luasHa = Number.parseFloat(row.luas_ha.toString()) || 0

      if (!uploadedAreas[tahunTanam]) {
        uploadedAreas[tahunTanam] = 0
      }
      uploadedAreas[tahunTanam] += luasHa
    })

    // Check each tahun_tanam in uploaded data
    for (const tahunTanam in uploadedAreas) {
      const uploadedArea = uploadedAreas[tahunTanam]
      const arealEntry = arealData.find((item) => item.tahun_tanam.toString() === tahunTanam)

      if (!arealEntry) {
        setAreaValidationError(`Tahun tanam ${tahunTanam} tidak ditemukan di data areal kebun`)
        return false
      }

      // Allow 1% tolerance for floating point differences
      const tolerance = 0.01
      const minAllowed = arealEntry.luas_ha * (1 - tolerance)
      const maxAllowed = arealEntry.luas_ha * (1 + tolerance)

      if (uploadedArea < minAllowed || uploadedArea > maxAllowed) {
        setAreaValidationError(
          `Total luas ha untuk tahun tanam ${tahunTanam} (${uploadedArea.toFixed(2)} ha) ` +
          `tidak sesuai dengan data areal kebun (${arealEntry.luas_ha} ha)`,
        )
        return false
      }
    }

    setAreaValidationError(null)
    return true
  }

  // Group areal data by planting years
  const getPlantingYears = () => {
    if (!arealData || arealData.length === 0) return []

    // Extract unique tahun_tanam values and sort them
    const years = [...new Set(arealData.map((item) => item.tahun_tanam))]
    return years.sort((a, b) => a - b)
  }
  const isNumber = (value: any): boolean => {
    return !isNaN(value) && !isNaN(parseFloat(value))
  }
  useEffect(() => {
    if (values.length > 0) {
      const mapped = values.map((value) => ({
        regional: rpc,
        kebun: kebun,
        afdeling: value[0],
        blok: value[1],
        luas_ha: value[2],
        varietas: value[3],
        fase_tbm: value[4],
        bulan_tanam: isNumber(value[5]) ? value[5] : "12", // default ke "12" jika bukan number
        tahun_tanam: value[6],
        umur_saat_ini_bulan: value[7],
        jumlah_pokok_awal_tanam: value[8],
        pkk_ha_awal_tanam: value[9],
        jumlah_pokok_sekarang: value[10],
        pkk_ha_saat_ini: value[11],
        lingkar_batang_cm: value[12],
        tinggi_tanaman_cm: value[13],
        jumlah_pelepah_bh: value[14],
        panjang_rachis_cm: value[15],
        tebal_petiola_cm: value[16],
        lebar_petiola_cm: value[17],
        jumlah_anak_daun: value[18],
        rerata_panjang_anak_daun: value[19],
        rerata_lebar_anak_daun: value[20],
        jumlah_pokok_sampel: value[21],
        tanggal_pengamatan: value[22],
        tahun: tahun,
        bulan: bulan,
        user_id: userId,
      }))

      setMappedData(mapped)

      // Validate fields
      const requiredFields = [
        "afdeling",
        "blok",
        "luas_ha",
        "varietas",
        "fase_tbm",
        "bulan_tanam",
        "tahun_tanam",
        "jumlah_pokok_awal_tanam",
        "jumlah_pokok_sekarang",
        "lingkar_batang_cm",
        "tinggi_tanaman_cm",
        "jumlah_pelepah_bh",
        "panjang_rachis_cm",
        "tebal_petiola_cm",
        "lebar_petiola_cm",
        "jumlah_anak_daun",
        "rerata_panjang_anak_daun",
        "rerata_lebar_anak_daun",
        "jumlah_pokok_sampel",
        "tanggal_pengamatan",
      ]
      const errors = mapped.map((row) => {
        const rowErrors: { [key: string]: boolean } = {}
        requiredFields.forEach((field) => {
          // Special validation for varietas field
          if (field === "varietas") {
            rowErrors[field] = !row[field] || row[field] === "" || !isValidVarietas(row[field])
          } else {
            rowErrors[field] = !row[field as keyof UploadData] || row[field as keyof UploadData] === ""
          }

          if (field === "bulan_tanam") {
            rowErrors[field] = !isNumber(row[field]) || row[field] === ""
          }
        })
        return rowErrors
      })

      setValidationErrors(errors)
      setHasEmptyFields(errors.some((row) => Object.values(row).some(Boolean)))

      // Validate total area
      validateTotalArea(mapped)
      setShowPreview(true)
    }
  }, [values, arealData])

  const router = useNavigate()
  const apiUrl = import.meta.env.VITE_API_IMMATURE

  const handleUpload = async (): Promise<void> => {
  if (hasEmptyFields) {
    toast.error("Tidak dapat mengupload karena ada kolom yang kosong atau varietas tidak valid")
    return
  }

  if (mappedData.length === 0) {
    toast.error("Tidak ada data yang akan diupload")
    return
  }

  if (areaValidationError) {
    toast.error("Tidak dapat mengupload karena luas area tidak sesuai dengan data kebun")
    return
  }

  setIsLoadingUpload(true)

  try {
    const response = await fetch(`${apiUrl}/vegetatif/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mappedData: mappedData,
      }),
    })

    const result = await response.json()
    
    if (response.ok) {
      setIsUploadingDone(true)
      toast.success(`Data berhasil diupload! (${mappedData.length} records)`)
    } else {
      throw new Error(result.error || "Gagal mengupload data")
    }
  } catch (error:any) {
    console.error("Upload failed:", error)
    toast.error(error.message || "Gagal mengupload data!")
  } finally {
    setIsLoadingUpload(false)
    setTimeout(() => {
      setIsUploadingDone(false)
    }, 3000)
  }
}

  const customStyles = {
    theme: (theme: any) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "var(--bg-secondary)",
        primary: "var(--text-primary)",
      },
    }),
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--bg-primary)",
      borderColor: "var(--border-primary)",
      borderRadius: "10.5rem",
      boxShadow: "none",
      color: "var(--text-primary)",
      width: "250px",
      minHeight: "2.5rem",
      "&:hover": {
        borderColor: "var(--border-primary)",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "black",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "0.5rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: state.isSelected ? "var(--text-primary)" : "var(--text-secondary)",
      backgroundColor: state.isSelected ? "var(--bg-secondary)" : "var(--bg-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      "&:hover": {
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--text-primary)",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "var(--text-primary)",
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: state.theme.mode === "dark" ? "white" : "var(--text-secondary)",
    }),
  }

  const bulanName = [
    { value: "1", label: "Januari" },
    { value: "4", label: "April" },
    { value: "8", label: "Agustus" },
    { value: "12", label: "Desember" },
  ]

  const tahunName = [
    { value: "2025", label: "2025" },
  ]

  const defaultValueTahun = tahunName.find((item) => item.value === getCurrentYear().toString())
  const defaultValueBulan = bulanName.find((item) => item.value === "4")

  // Check if upload should be disabled
  const isUploadDisabled = !fileName || isLoadingUpload || hasEmptyFields || !!areaValidationError

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
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
                className=""
                defaultValue={defaultValueTahun}
                onChange={(e: any) => setTahun(e.value)}
              />

              <Select
                styles={customStyles}
                className="float-end ml-5"
                options={bulanName}
                defaultValue={defaultValueBulan}
                onChange={(e: any) => setBulan(e.value)}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Tahun Tanam yang Tersedia di Kebun:</p>
              <div className="flex flex-wrap gap-3">
                {getPlantingYears().map((year) => (
                  <div key={year} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`year-${year}`}
                      checked={selectedYears.includes(year)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedYears((prev) => [...prev, year])
                        } else {
                          setSelectedYears((prev) => prev.filter((y) => y !== year))
                        }
                      }}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`year-${year}`} className="text-sm font-medium">
                      {year}
                    </label>
                  </div>
                ))}
              </div>
              {selectedYears.length > 0 ? (
                <p className="text-xs text-green-600 mt-2">
                  Hanya data untuk tahun tanam {selectedYears.join(", ")} yang akan diproses
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-2">
                  Semua tahun tanam akan diproses jika tidak ada yang dipilih
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-black dark:text-cyan-400 font-semibold">
                Fitur baru : Data akan otomatis diperbarui saat mengunggah ulang dengan afdeling, blok, bulan, dan tahun
                yang sama
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-5 grid">
              <div
                className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-black py-5"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <label
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-dashed"
                  htmlFor="fileInput"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      aria-hidden="true"
                      className="mb-3 h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    {fileName ? (
                      <div className="mb-2 flex items-center">
                        <p className="text-sm text-gray-500 ">{fileName}</p>
                        <BsTrash className="ml-2 cursor-pointer text-red-500" onClick={handleRemoveFile} />
                      </div>
                    ) : !fileName && loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                          flexDirection: "column",
                        }}
                      >
                        <CircularProgress />
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                          Loading...
                        </Typography>
                      </Box>
                    ) : (
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload file .csv atau .xlsx</span> atau drag and drop
                      </p>
                    )}
                  </div>

                  <input
                    type="file"
                    id="fileInput"
                    name="file"
                    onChange={handleFileChange}
                    accept=".csv, .xlsx"
                    className="hidden"
                    disabled={isLoadingUpload}
                  />
                </label>
              </div>

              {/* Preview Table */}
              {showPreview && (
                <div className="mt-6 overflow-x-auto">
                  <div className="mb-4">
                    {hasEmptyFields ? (
                      <div className="flex items-center text-yellow-600">
                        <BsExclamationCircle className="mr-2" />
                        <span>Ada kolom yang kosong. Harap periksa data sebelum upload.</span>
                      </div>
                    ) : areaValidationError ? (
                      <div className="flex items-center text-red-600">
                        <BsExclamationCircle className="mr-2" />
                        <span>{areaValidationError}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-lg text-black dark:text-cyan-400 font-semibold">
                        <span>
                          *Semua data valid dan siap untuk diupload. Silahkan klik Tombol Upload File untuk Melanjutkan
                        </span>
                      </div>
                    )}
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Afdeling
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Blok
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Luas (Ha)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Varietas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Tahun Tanam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Bulan Tanam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {mappedData.map((row, index) => {
                        const rowErrors = validationErrors[index] || {}
                        const hasError = Object.values(rowErrors).some(Boolean)

                        return (
                          <tr key={index} className={hasError ? "bg-yellow-50" : ""}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                            <td
                              className={`whitespace-nowrap px-6 py-4 text-sm ${rowErrors.afdeling ? "text-red-500" : "text-gray-500"}`}
                            >
                              {row.afdeling || <span className="text-red-500">(kosong)</span>}
                            </td>
                            <td
                              className={`whitespace-nowrap px-6 py-4 text-sm ${rowErrors.blok ? "text-red-500" : "text-gray-500"}`}
                            >
                              {row.blok || <span className="text-red-500">(kosong)</span>}
                            </td>
                            <td
                              className={`whitespace-nowrap px-6 py-4 text-sm ${rowErrors.luas_ha ? "text-red-500" : "text-gray-500"}`}
                            >
                              {row.luas_ha || <span className="text-red-500">(kosong)</span>}
                            </td>
                            <td
                              className={`whitespace-nowrap px-6 py-4 text-sm ${rowErrors.varietas ? "text-red-500" : "text-gray-500"}`}
                            >
                              {row.varietas || <span className="text-red-500">(kosong)</span>}
                              {row.varietas && !isValidVarietas(row.varietas) && (
                                <span className="block text-xs text-red-500">Varietas tidak valid</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.tahun_tanam}</td>
                            <td className={`whitespace-nowrap px-6 py-4 text-sm ${rowErrors.bulan_tanam ? "text-red-500" : "text-gray-500"
                              }`}>
                              {row.bulan_tanam || <span className="text-red-500">(kosong)</span>}
                              {rowErrors.bulan_tanam && (
                                <span className="block text-xs text-red-500">Harus berupa angka 1 - 12</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {hasError ? (
                                <span className="text-yellow-600">Perlu diperbaiki</span>
                              ) : (
                                <span className="text-green-600">Valid</span>
                              )}
                            </td>

                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-3">
                {isLoadingUpload ? (
                  <div className="h-2.5 w-1/6 rounded-full bg-gray-200 ">
                    <div
                      className="animate-blink h-2.5 rounded-full bg-green-600 transition ease-in-out"
                      style={{ width: `${progressValue}%` }}
                    ></div>
                  </div>
                ) : null}

                {isUploadingDone ? <BsFillCheckCircleFill className="h-7 w-7 text-green-600" /> : null}

                {!isLoadingUpload ? (
                  <>
                    <button
                      onClick={() => handleUpload()}
                      disabled={isUploadDisabled}
                      className={`cursor-pointer rounded-full px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 ${isUploadDisabled
                        ? "bg-gray-400 hover:bg-gray-500 focus:ring-gray-300"
                        : "bg-green-600 hover:bg-green-800 focus:ring-green-300"
                        }`}
                    >
                      Unggah File
                    </button>
                    <button className="cursor-pointer rounded-full bg-slate-600 px-5 py-[.675rem] text-center text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed">
                      <Link to="/data-vegetatif">Kembali</Link>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
