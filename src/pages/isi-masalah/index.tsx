"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme-switch"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/custom/button"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import axios from "axios"
import cookies from "js-cookie"
import { useParams } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Select from "react-select"
import { customStyles } from "@/styles/select-styles"

import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"

import imageCompression from "browser-image-compression"
import { useForm, Controller } from "react-hook-form"
import toast from "react-hot-toast"

export default function PiVegetatif() {
  const { id } = useParams()

  const vegId = id || ""

  interface PiVegetatifType {
    regional: string
    kebun: string
    afdeling: string
    tahun_tanam: string
    why1: string
    why2: string
    why3: string
    blok: string
    measurement_pi: string
    value_pi: string
    measurement_ca: string
    value_ca: string
    bulan: string
    tahun: string
  }

  interface CaItem {
    caName: string
    value: string
    startDate: Date | undefined
    endDate: Date | undefined
    budgetAvailable: "tersedia" | "tidak_tersedia" | ""
    images: Array<{ file: File; preview: string; compressing: boolean }>
  }

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      regional: "",
      kebun: "",
      afdeling: "",
      tahun_tanam: "",
      why1: { value: "", label: "" },
      why2: { value: "", label: "" },
      why3: { value: "", label: "" },
      value_pi: "",
      correctiveactions: [],
      blok: "",
      measurement_pi: "",
      keterangan: "",
    },
  })

  const [PiVegetatif, setDataVegetatif] = useState<PiVegetatifType[]>([])
  const [dataDetailPICA, setDataDetailPICA] = useState<any[]>([])

  const [why, setWhy] = useState([])
  const [why1, setWhy1] = useState<string[]>([])
  const [why2, setWhy2] = useState<string[]>([])
  const [why3, setWhy3] = useState<string[]>([])
  const [caMaster, setCaMaster] = useState<any[]>([])

  const [caItems, setCaItems] = useState<CaItem[]>([])
  const [measurementPi, setMeasurementPi] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ongoingCompressions, setOngoingCompressions] = useState<number>(0)

  const apiUrl = import.meta.env.VITE_API_IMMATURE
  const user = cookies.get("user")
  const fullname = user ? JSON.parse(user).fullname : "user"
  const iduser = user ? JSON.parse(user).id : ""

  const account_type = user ? JSON.parse(user).account_type : "user"

  const fetchInvesPiVegetatif = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/why`, {})
      setWhy(response.data)
      const w1 = response.data.map((item: any) => item.w1)
      const distinctW1 = [...new Set(w1)]
      setWhy1(distinctW1 as string[])
    } catch (error: any) {
      console.error("Error fetching PiVegetatif:", error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  const fetchInvesCaVegetatif = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/ca`, {})
      setCaMaster(response.data)
    } catch (error: any) {
      console.error("Error fetching PiVegetatif:", error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }


  // ... [keep all your existing interfaces and state declarations]

  // Add these state variables for edit mode
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Modify your fetchDetailPICA function to handle both initial load and edit mode
  const fetchDetailPICA = async (idToFetch?: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/get-final-detail-pica`, {
        vegetatif_id: idToFetch || id,
      })
      setDataDetailPICA(response.data.data)
      if (editMode && idToFetch) {
        // Pre-fill form when editing
        const data = response.data.data
        setValue("why1", { value: data.why1, label: data.why1 })
        setValue("why2", { value: data.why2, label: data.why2 })
        setValue("why3", { value: data.why3, label: data.why3 })
        setValue("value_pi", data.value_pi)
        setValue("keterangan", data.keterangan)
        setMeasurementPi(data.measurement_pi || "")
        
        // Handle CA items for editing
        if (data.correctiveActions && data.correctiveActions.length > 0) {
          const formattedCaItems = data.correctiveActions.map((ca: any) => ({
            caName: ca.ca,
            value: ca.value,
            startDate: ca.startDate ? new Date(ca.startDate) : undefined,
            endDate: ca.endDate ? new Date(ca.endDate) : undefined,
            budgetAvailable: ca.budgetAvailable || "",
            images: ca.images.map((img: any) => ({
              file: new File([], img.name, { type: 'image/jpeg' }),
              preview: img.file,
              compressing: false
            }))
          }))
          setCaItems(formattedCaItems)
        }
      }
    } catch (error) {
      console.error("Error fetching Detail PICA:", error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  // Add delete function
  const handleDelete = async (idToDelete: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await axios.post(`${apiUrl}/delete-pica`, {
          id: idToDelete
        })
        if (response.data.success) {
          toast.success("Record deleted successfully")
          fetchDetailPICA() // Refresh data
        } else {
          toast.error(response.data.error || "Failed to delete record")
        }
      } catch (error) {
        console.error("Error deleting record:", error)
        toast.error("Error deleting record")
      }
    }
  }

  // Add edit function
  const handleEdit = (idToEdit: string) => {
    setEditMode(true)
    setEditingId(idToEdit)
    fetchDetailPICA(idToEdit)
    window.scrollTo(0, 0) // Scroll to top of form
  }


  const getVwVegetatifById = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/get-vw-vegetatif`, {
        id: id,
      })
      setDataVegetatif(response.data)
    } catch (error) {
      console.error("Error fetching PiVegetatif:", error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  useEffect(() => {
    getVwVegetatifById()
    fetchInvesPiVegetatif()
    fetchInvesCaVegetatif()
    fetchDetailPICA()
  }, [])

  const handleW1Change = (selectedOption: any) => {
    const selectedW1 = selectedOption?.value
    const filteredWhy2 = why.filter((item: any) => item.w1 === selectedW1)
    const w2 = filteredWhy2.map((item: any) => item.w2)
    const distinctW2 = [...new Set(w2)]
    setWhy2(distinctW2 as string[])
    setValue("why2", { value: "", label: "" })
    setValue("why3", { value: "", label: "" })
    setValue("value_pi", "")
    setMeasurementPi("")
    setCaItems([])
  }

  const handleW2Change = (selectedOption: any) => {
    const selectedW2 = selectedOption?.value
    const filteredWhy3 = why.filter((item: any) => item.w2 === selectedW2)
    const w3 = filteredWhy3.map((item: any) => item.w3)
    const distinctW3 = [...new Set(w3)]
    setWhy3(distinctW3 as string[])
    setValue("why3", { value: "", label: "" })
    setValue("value_pi", "")
    setMeasurementPi("")
    setCaItems([])
  }

  const handleW3Change = (selectedOption: any) => {
    const selectedW3 = selectedOption?.value
    const filteredCa = caMaster.filter((item: any) => item.w3 === selectedW3)

    // Find the selected why3 item to get measurement and value

    type Why3Type = {
      w3: string
      measurement: string
      value: string
    }

    const selectedWhy3: Why3Type | undefined = why.find((item: any) => item.w3 === selectedW3) || { w3: "", measurement: "", value: "" }
    setMeasurementPi(selectedWhy3?.measurement || "")
    setValue("value_pi", selectedWhy3?.value || "")

    // Reset CA items when why3 changes
    setCaItems([])
  }

  const handleCaChange = (selectedOptions: any) => {
    if (!selectedOptions) {
      setCaItems([]);
      return;
    }

    const selectedCaNames = selectedOptions.map((option: any) => option.value);

    // Remove deselected items
    const updatedCaItems = caItems.filter(item =>
      selectedCaNames.includes(item.caName)
    );

    // Add new items
    selectedCaNames.forEach((caName: string) => {
      if (!updatedCaItems.some(item => item.caName === caName)) {
        const caData = caMaster.find((item: any) => item.ca === caName);
        updatedCaItems.push({
          caName,
          value: caData?.value || "",
          startDate: undefined,
          endDate: undefined,
          budgetAvailable: "",
          images: []
        });
      }
    });

    setCaItems(updatedCaItems);
  };

  const handleCaValueChange = (caName: string, value: string) => {
    setCaItems(prev => prev.map(item =>
      item.caName === caName ? { ...item, value } : item
    ))
  }

  const handleStartDateChange = (caName: string, date: Date | undefined) => {
    setCaItems(prev => prev.map(item =>
      item.caName === caName ? { ...item, startDate: date } : item
    ))
  }

  const handleEndDateChange = (caName: string, date: Date | undefined) => {
    setCaItems(prev => prev.map(item =>
      item.caName === caName ? { ...item, endDate: date } : item
    ))
  }

  const handleBudgetChange = (caName: string, value: "tersedia" | "tidak_tersedia") => {
    setCaItems(prev => prev.map(item =>
      item.caName === caName ? { ...item, budgetAvailable: value } : item
    ))
  }

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
    }

    try {
      const compressedFile = await imageCompression(file, options)
      if (compressedFile.size > 102400) {
        const stricterOptions = {
          ...options,
          maxSizeMB: 0.09,
          maxWidthOrHeight: 1600,
          initialQuality: 0.6,
        }
        return await imageCompression(file, stricterOptions)
      }
      return compressedFile
    } catch (error) {
      console.error("Error compressing image:", error)
      return file
    }
  }

  const handleCaFileChange = async (e: React.ChangeEvent<HTMLInputElement>, caName: string) => {
    if (!e.target.files?.length || ongoingCompressions > 0) return;

    const files = Array.from(e.target.files);
    const caIndex = caItems.findIndex(item => item.caName === caName);

    if (caIndex === -1 || files.length === 0) return;

    // Check available slots
    const availableSlots = 5 - caItems[caIndex].images.length;
    if (availableSlots <= 0) {
      toast.error(`Maksimal 5 file untuk ${caName}`);
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    setOngoingCompressions(prev => prev + filesToProcess.length);

    // Add placeholder images
    setCaItems(prev => {
      const updated = [...prev];
      updated[caIndex] = {
        ...updated[caIndex],
        images: [
          ...updated[caIndex].images,
          ...filesToProcess.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            compressing: true
          }))
        ]
      };
      return updated;
    });

    // Process files in parallel
    await Promise.all(filesToProcess.map(async (file, i) => {
      try {
        const compressedFile = await compressImage(file);

        setCaItems(prev => {
          const updated = [...prev];
          const imgIndex = updated[caIndex].images.length - filesToProcess.length + i;
          updated[caIndex].images[imgIndex] = {
            file: compressedFile,
            preview: URL.createObjectURL(compressedFile),
            compressing: false
          };
          return updated;
        });
      } catch (error) {
        console.error("Error processing file:", error);
        // Keep the original file if compression fails
      } finally {
        setOngoingCompressions(prev => prev - 1);
      }
    }));

    toast.success(`Uploaded ${filesToProcess.length} file(s) for ${caName}`);
  };

  const removeCaImage = (caName: string, imageIndex: number) => {
    setCaItems(prev => {
      const updated = [...prev]
      const caIndex = updated.findIndex(item => item.caName === caName)
      if (caIndex === -1) return prev

      URL.revokeObjectURL(updated[caIndex].images[imageIndex].preview)
      updated[caIndex].images.splice(imageIndex, 1)
      return updated
    })
  }

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Add basic PI data
      formData.append("id", id || "");
      formData.append("why1", data.why1?.value || "");
      formData.append("why2", data.why2?.value || "");
      formData.append("why3", data.why3?.value || "");
      formData.append("value_pi", data.value_pi || "");
      formData.append("blok", PiVegetatif[0]?.blok || "");
      formData.append("keterangan", data.keterangan || "");
      formData.append("regional", PiVegetatif[0]?.regional || "");
      formData.append("kebun", PiVegetatif[0]?.kebun || "");
      formData.append("afdeling", PiVegetatif[0]?.afdeling || "");
      formData.append("tahun_tanam", PiVegetatif[0]?.tahun_tanam || "");
      formData.append("vegetatif_id", vegId || "");
      formData.append(`bulan`, PiVegetatif[0]?.bulan || "");
      formData.append(`tahun`, PiVegetatif[0]?.tahun || "");
      // Add CA data
      caItems.forEach((caItem, index) => {
        formData.append(`caItems[${index}][caName]`, caItem.caName);
        formData.append(`caItems[${index}][value]`, caItem.value);
        formData.append(`caItems[${index}][startDate]`, caItem.startDate?.toISOString() || "");
        formData.append(`caItems[${index}][endDate]`, caItem.endDate?.toISOString() || "");
        formData.append(`caItems[${index}][budgetAvailable]`, caItem.budgetAvailable);

        // bulan

        // Add CA images
        caItem.images.forEach((image, imgIndex) => {
          formData.append(`caItems[${index}][images]`, image.file);
        });
      });

      //corrective actions json in BE 
      const correctiveActions = await Promise.all(caItems.map(async (item) => {
        const images = await Promise.all(item.images.map(async (image) => { 
          if (image.compressing) {
            // Tunggu hingga kompresi selesai
            await new Promise(resolve => {
              const interval = setInterval(() => {
                if (!image.compressing) {
                  clearInterval(interval);
                  resolve(true);
                }
              }, 100);
            });
          }
          if (!image.file) {
            return { name: "", file: "", compressing: false };
          }
          const base64File = await getBase64(image.file)  ;

          return {
            name: image.file.name,
            file: base64File,
            compressing: false,
          };

        }));

        return {
          ca: item.caName,
          value: item.value,
          startDate: item.startDate ? format(item.startDate, "yyyy-MM-dd") : "",
          endDate: item.endDate ? format(item.endDate, "yyyy-MM-dd") : "",
          budgetAvailable: item.budgetAvailable,
          images: images,
        };
      }));


      formData.append("created_by", iduser || "");

      // Fungsi untuk mengkonversi File/Blob ke base64
      function getBase64(file: any) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      formData.append("correctiveActions", JSON.stringify(correctiveActions));

      const response = await axios.post(`${apiUrl}/submit-pi-ca`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Optionally redirect or reset form
      } else {
        toast.error(response.data.error || "Failed to save data");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.error || error.message || "Terjadi kesalahan");
    }
  };

  const picOpt = [
    { value: "ASKEB", label: "Asisten Kebun" },
    { value: "MANAJER", label: "Manager" },
    { value: "GM", label: "General Manager" },
    { value: "KABAG TANAMAN", label: "Kabag Tanaman" },
    { value: "SEVP", label: "Senior Vice President" },
    { value: "REGION HEAD", label: "Region Head" },
    { value: "DIVISI TEKNIS HO", label: "Divisi Teknis HO" },
  ]

  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="mb-2 w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-900 dark:to-cyan-900">
          <h3 className="text-2xl my-2 text-center">Input Problem Identification & Corrective Actions</h3>
          <div className="space-y-0.5">
            <div className="w-full p-4 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="w-full dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Problem Identification</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="regional" className="text-sm font-medium">
                        Regional
                      </label>
                      <Input id="regional" value={PiVegetatif[0]?.regional} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="kebun" className="text-sm font-medium">
                        Kebun
                      </label>
                      <Input id="kebun" value={PiVegetatif[0]?.kebun} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="afdeling" className="text-sm font-medium">
                        Afdeling
                      </label>
                      <Input id="afdeling" value={PiVegetatif[0]?.afdeling} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="tahun" className="text-sm font-medium">
                        Tahun Tanam
                      </label>
                      <Input id="tahun" value={PiVegetatif[0]?.tahun_tanam} readOnly />
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Input Problem Identifications</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="why1" className="text-sm font-medium">
                        Why 1
                      </label>
                      <Controller
                        name="why1"
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={customStyles}
                            options={why1.map((item: any) => ({
                              value: item,
                              label: item,
                            }))}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption)
                              handleW1Change(selectedOption)
                            }}
                            placeholder="Pilih Why 1"
                            isClearable
                            isSearchable
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="why2" className="text-sm font-medium">
                        Why 2
                      </label>
                      <Controller
                        name="why2"
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={customStyles}
                            options={why2.map((item: any) => ({
                              value: item,
                              label: item,
                            }))}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption)
                              handleW2Change(selectedOption)
                            }}
                            placeholder="Pilih Why 2"
                            isClearable
                            isSearchable
                            isDisabled={!watch("why1")}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="why3" className="text-sm font-medium">
                        Why 3
                      </label>
                      <Controller
                        name="why3"
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={customStyles}
                            options={why3.map((item: any) => ({
                              value: item,
                              label: item,
                            }))}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption)
                              handleW3Change(selectedOption)
                            }}
                            placeholder="Pilih Why 3"
                            isClearable
                            isSearchable
                            isDisabled={!watch("why2")}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="blok" className="text-sm font-medium">
                        No. Blok
                      </label>
                      <Input id="no_blok" value={PiVegetatif[0]?.blok} readOnly />
                    </div>
                  </CardContent>
                </Card>

                {watch("why3") && watch("why3")?.value && (
                  <Card className="w-full dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                    <CardContent className="grid grid-cols-1">
                      <div className="space-y-2 w-full mt-5 relative">
                        <label htmlFor="value_pi" className="text-md font-medium">
                          Problem Identification Blok {PiVegetatif[0]?.blok}:{" "}
                          <span className="text-red-500">{watch("why3")?.label}</span>
                        </label>
                        <Input
                          className="w-full pl-20" // Added padding for measurement badge
                          id="value_pi"
                          {...register("value_pi")}
                          placeholder="Masukkan nilai identifikasi masalah"
                          type="number"
                        />
                        {measurementPi && (
                          <span className="absolute left-2 top-9 text-sm font-semibold dark:text-white">
                            {measurementPi}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="w-full dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Corrective Action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="correctiveAction" className="text-sm font-medium">
                        Pilih PIC :
                      </label>
                      <Controller
                        name="correctiveactions"
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={customStyles}
                            options={picOpt}

                            placeholder="Pilih PIC"
                            isClearable
                            isSearchable
                            isMulti
                            isDisabled={!watch("why3")}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="correctiveAction" className="text-sm font-medium">
                        Pilih Corrective Action :
                      </label>
                      <Controller
                        name="correctiveactions"
                        control={control}
                        render={({ field }) => (
                          <Select
                            styles={customStyles}
                            options={caMaster
                              .filter((item: any) => item.w3 === watch("why3")?.value)
                              .map((item: any) => ({
                                value: item.ca,
                                label: item.ca,
                              }))}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption)
                              handleCaChange(selectedOption)
                            }}
                            placeholder="Pilih Corrective Action"
                            isClearable
                            isSearchable
                            isMulti
                            isDisabled={!watch("why3")}
                          />
                        )}
                      />
                    </div>

                    {caItems.length > 0 && (
                      <div className="space-y-6 mt-4">
                        <h3 className="text-md font-medium">Input Corrective Action</h3>

                        {caItems.map((caItem) => {
                          const caData = caMaster.find((item: any) => item.ca === caItem.caName)
                          const measurement = caData?.measurement || ""

                          return (
                            <div key={caItem.caName} className="border rounded-lg p-4 space-y-4">
                              <h4 className="font-medium">{caItem.caName}</h4>

                              <div className="relative">
                                <Input
                                  className="w-full pl-20" // Added padding for measurement badge
                                  value={caItem.value}
                                  onChange={(e) => handleCaValueChange(caItem.caName, e.target.value)}
                                  placeholder="Masukkan nilai corrective action"
                                  type="number"
                                />
                                {measurement && (
                                  <span className="absolute left-2 top-2 text-sm font-semibold dark:text-white">
                                    {measurement}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Jadwal Mulai CA:</label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !caItem.startDate && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {caItem.startDate ? format(caItem.startDate, "PPP") : <span>Pilih tanggal</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={caItem.startDate}
                                        onSelect={(date) => handleStartDateChange(caItem.caName, date)}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Jadwal Akhir CA:</label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !caItem.endDate && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {caItem.endDate ? format(caItem.endDate, "PPP") : <span>Pilih tanggal</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={caItem.endDate}
                                        onSelect={(date) => handleEndDateChange(caItem.caName, date)}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium"> Anggaran Tersedia Dianggarkan RKAP/RKO :</label>
                                <div className="flex space-x-4">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      checked={caItem.budgetAvailable === "tersedia"}
                                      onChange={() => handleBudgetChange(caItem.caName, "tersedia")}
                                      className="h-4 w-4 text-primary"
                                    />
                                    <span>Tersedia</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      checked={caItem.budgetAvailable === "tidak_tersedia"}
                                      onChange={() => handleBudgetChange(caItem.caName, "tidak_tersedia")}
                                      className="h-4 w-4 text-primary"
                                    />
                                    <span>Tidak Tersedia</span>
                                  </label>
                                </div>
                              </div>

                              <div className="border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-lg p-6 text-center hover:dark:bg-slate-800 transition-colors relative">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-400">Upload gambar untuk {caItem.caName}</p>
                                <p className="mt-1 text-xs text-gray-400">
                                  Maksimal 5 file ({5 - caItem.images.length} slot tersedia)
                                </p>
                                <p className="mt-1 text-xs text-gray-600 dark:text-cyan-400">
                                  * Input file akan dinonaktifkan selama auto kompres file berlangsung
                                </p>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${ongoingCompressions > 0 ? "cursor-not-allowed" : "cursor-pointer"
                                    }`}
                                  onChange={(e) => handleCaFileChange(e, caItem.caName)}
                                  disabled={caItem.images.length >= 5 || ongoingCompressions > 0}
                                />
                              </div>

                              {caItem.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                  {caItem.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="relative group">
                                      <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                                        <img
                                          src={image.preview}
                                          alt={`Preview ${imgIndex} for ${caItem.caName}`}
                                          className="w-full h-full object-cover"
                                        />
                                        {image.compressing && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                          </div>
                                        )}
                                      </div>
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeCaImage(caItem.caName, imgIndex)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-200">
                                        {(image.file.size / 1024).toFixed(1)} KB
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="keterangan" className="text-sm font-medium">
                        Keterangan :
                      </label>
                      <Textarea id="keterangan" rows={5} {...register("keterangan")} />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Simpan Masalah"}
                  </Button>
                  <Link to="/pica-tbm">
                    <Button variant="outline">Kembali Ke Halaman Sebelumnya</Button>
                  </Link>
                </div>
              </form>
            </div>
            
    {/* Detail Data Section as Table */}
                {dataDetailPICA.length > 0 && (
                  <Card className="w-full dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        Detail Data Problem Identification & Corrective Action Blok {PiVegetatif[0]?.blok}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Why 1</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Why 2</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Why 3</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Nilai PI</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">CA</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Nilai CA</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Periode</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Anggaran</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Evidence CA</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                            {dataDetailPICA.map((item, idx) => (
                              <tr key={`${item.id}-${idx}`} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{item.why1}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{item.why2}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{item.why3}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{item.value_pi} {measurementPi}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{item.corrective_ca}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{item.corrective_value} {measurementPi}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                  {format(new Date(item.corrective_start_date), 'PPP')} - {format(new Date(item.corrective_end_date), 'PPP')}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                  {item.corrective_budget_available === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
                                </td>

                                {/* item json images { file: data image } make to <img */}

                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                  {item.images && item.images.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                      {item.images.map((img: any, imgIdx: number) => (
                                        <img
                                          key={imgIdx}
                                          src={img.file}
                                          alt={`Evidence ${imgIdx + 1}`}
                                          className="w-100 object-cover rounded"
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Tidak ada evidence</span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                  <Button variant="secondary" onClick={() => handleEdit(item.id)}>
                                    Edit
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                                    Hapus
                                  </Button>
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Actions */}
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" onClick={() => handleDelete(editingId || '')}>
                          Hapus Semua
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
            

          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}