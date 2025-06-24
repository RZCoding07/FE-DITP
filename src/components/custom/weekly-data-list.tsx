"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { addDays, format, startOfWeek, endOfWeek, differenceInWeeks, parseISO, isWithinInterval } from "date-fns"
import { CalendarIcon, Plus, Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

interface WeekData {
    weekNumber: number
    startDate: Date
    endDate: Date
    progress: number
    images: { file: File; preview: string; compressing: boolean }[]
    activeCAs: number[] // Track which CAs are active in this week
}

interface CADateRange {
    startDate: Date
    endDate: Date
    caIndex: number
    caName: string
    value?: string
    budgetAvailable?: string
}

interface DataProps {
    id?: string
    startDate: string | Date
    endDate: string | Date
    caDateRanges?: CADateRange[]
}

interface ApiWeekData {
    week_number: number
    start_date: string
    end_date: string
    progress_percentage: number
    images: string[]
}

export default function WeeklyDateList({ 
    id, 
    startDate: initialStartDate, 
    endDate: initialEndDate,
    caDateRanges = []
}: DataProps) {
    const [startDate, setStartDate] = useState<Date>(() => 
        initialStartDate instanceof Date ? initialStartDate : parseISO(initialStartDate as string),
    )
    const [endDate, setEndDate] = useState<Date>(() => 
        initialEndDate instanceof Date ? initialEndDate : parseISO(initialEndDate as string),
    )
    const [weeks, setWeeks] = useState<WeekData[]>([])
    const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [progress, setProgress] = useState<number>(0)
    const [images, setImages] = useState<{ file: File; preview: string; compressing: boolean }[]>([])
    const [ongoingCompressions, setOngoingCompressions] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_IMMATURE

    useEffect(() => {
        if (initialStartDate && initialEndDate) {
            generateWeeks()
            fetchWeeklyProgress()
        }
    }, [id])

    const fetchWeeklyProgress = async () => {
        if (!id) return
        try {
            setIsLoading(true)
            const response = await axios.get(`${apiUrl}/weekly-progress/${id}`)
            const data: ApiWeekData[] = response.data
            const convertedWeeks = data.map(week => ({
                weekNumber: week.week_number,
                startDate: parseISO(week.start_date),
                endDate: parseISO(week.end_date),
                progress: week.progress_percentage,
                images: week.images.map(url => ({
                    file: new File([], url.split('/').pop() || 'image.jpg'),
                    preview: url,
                    compressing: false
                })),
                activeCAs: [] // Will be populated in generateWeeks
            }))

            setWeeks(prevWeeks => {
                return prevWeeks.map(week => {
                    const savedWeek = convertedWeeks.find(w => w.weekNumber === week.weekNumber)
                    return savedWeek ? { ...savedWeek, activeCAs: week.activeCAs } : week
                })
            })
        } catch (error) {
            console.error("Error fetching weekly progress:", error)
            toast({
                title: "Error",
                description: "Failed to load weekly progress data",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const generateWeeks = () => {
        if (!startDate || !endDate) return
        if (startDate > endDate) {
            toast({
                title: "Error",
                description: "Start date must be before end date",
                variant: "destructive",
            })
            return
        }

        const firstWeekStart = startOfWeek(startDate, { weekStartsOn: 1 })
        const numberOfWeeks = Math.ceil(differenceInWeeks(endDate, firstWeekStart) + 1)

        const weeksList = Array.from({ length: numberOfWeeks }, (_, i) => {
            const weekStartDate = addDays(firstWeekStart, i * 7)
            const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 })
            const actualWeekEndDate = weekEndDate > endDate ? endDate : weekEndDate

            // Determine which CAs are active in this week
            const activeCAs = caDateRanges
                .filter(ca => {
                    const weekInterval = { start: weekStartDate, end: actualWeekEndDate }
                    const caInterval = { start: ca.startDate, end: ca.endDate }
                    
                    // Check if there's any overlap between week and CA date range
                    return (
                        isWithinInterval(ca.startDate, weekInterval) ||
                        isWithinInterval(ca.endDate, weekInterval) ||
                        isWithinInterval(weekStartDate, caInterval) ||
                        isWithinInterval(actualWeekEndDate, caInterval)
                    )
                })
                .map(ca => ca.caIndex)

            return {
                weekNumber: i + 1,
                startDate: weekStartDate,
                endDate: actualWeekEndDate,
                progress: 0,
                images: [],
                activeCAs
            }
        })

        setWeeks(weeksList)
    }

    const openProgressDialog = async (week: WeekData) => {
        setSelectedWeek(week)
        setProgress(week.progress)
        const imagesWithPreviews = await Promise.all(
            week.images.map(async img => {
                if (img.preview.startsWith('http')) {
                    try {
                        const response = await fetch(img.preview)
                        const blob = await response.blob()
                        return {
                            file: new File([blob], img.preview.split('/').pop() || 'image.jpg', { type: blob.type }),
                            preview: URL.createObjectURL(blob),
                            compressing: false
                        }
                    } catch (error) {
                        console.error("Error fetching image:", error)
                        return {
                            file: new File([], 'image.jpg'),
                            preview: img.preview,
                            compressing: false
                        }
                    }
                }
                return img
            })
        )
        setImages(imagesWithPreviews)
        setDialogOpen(true)
    }

    const removeImage = (imageIndex: number) => {
        setImages((prev) => {
            const updated = [...prev]
            URL.revokeObjectURL(updated[imageIndex].preview)
            updated.splice(imageIndex, 1)
            return updated
        })
    }

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    const saveProgress = async () => {
        if (!selectedWeek) return;
        try {
            const payload: {
                project_id: string;
                week_number: number;
                start_date: string;
                end_date: string;
                progress_percentage: number;
                image_data: { name: string; data: string; size: number; type: string }[];
            } = {
                project_id: id || '1',
                week_number: selectedWeek.weekNumber,
                start_date: selectedWeek.startDate.toISOString(),
                end_date: selectedWeek.endDate.toISOString(),
                progress_percentage: progress,
                image_data: []
            };

            payload.image_data = await Promise.all(images.map(async (image) => {
                const base64String = await getBase64(image.file);
                return {
                    name: image.file.name,
                    data: base64String,
                    size: image.file.size,
                    type: image.file.type
                };
            }));

            const response = await axios.post(`${apiUrl}/weekly-progress/save`, payload)
            const updatedWeeks = weeks.map(week => 
                week.weekNumber === selectedWeek.weekNumber 
                    ? {
                        ...week,
                        progress,
                        images: images.map(img => ({
                            file: img.file,
                            preview: img.preview,
                            compressing: false
                        }))
                    }
                    : week
            );
            setWeeks(updatedWeeks)
            setDialogOpen(false)
            toast({
                title: "Progress Updated",
                description: `Week ${selectedWeek.weekNumber} progress ${response.data.message.includes('created') ? 'created' : 'updated'} successfully.`,
            })
        } catch (error) {
            console.error('Error saving progress:', error)
            toast({
                title: "Error",
                description: "Failed to save progress",
                variant: "destructive",
            })
        }
    }

    const compressImage = async (file: File) => {
        const imageCompression = (await import("browser-image-compression")).default
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || ongoingCompressions > 0) return
        const files = Array.from(e.target.files)
        const availableSlots = 5 - images.length
        if (availableSlots <= 0) {
            toast({
                title: "Maximum Files Reached",
                description: "You can only upload up to 5 images per week",
                variant: "destructive",
            })
            return
        }

        const filesToProcess = files.slice(0, availableSlots)
        setOngoingCompressions((prev) => prev + filesToProcess.length)
        setImages((prev) => [
            ...prev,
            ...filesToProcess.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                compressing: true,
            })),
        ])

        await Promise.all(
            filesToProcess.map(async (file, i) => {
                try {
                    const compressedFile = await compressImage(file)
                    setImages((prev) => {
                        const updated = [...prev]
                        const imgIndex = prev.length - filesToProcess.length + i
                        updated[imgIndex] = {
                            file: compressedFile,
                            preview: URL.createObjectURL(compressedFile),
                            compressing: false,
                        }
                        return updated
                    })
                } catch (error) {
                    console.error("Error processing file:", error)
                } finally {
                    setOngoingCompressions((prev) => prev - 1)
                }
            }),
        )

        toast({
            title: "Images Uploaded",
            description: `Uploaded ${filesToProcess.length} image(s) successfully`,
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Overall Start Date</label>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "PPP")}
                    </Button>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Overall End Date</label>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, "PPP")}
                    </Button>
                </div>
                <div className="self-end flex gap-2">
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>

            {/* Display CA Date Ranges */}
            {caDateRanges.length > 0 && (
                <Card className="bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 bg-white shadow-md">
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Corrective Action Date Ranges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {caDateRanges.map((ca, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <Badge variant="outline" className="mb-2">{ca.caName || `CA ${index + 1}`}</Badge>
                                    <div className="text-sm">
                                        <div><strong>Start:</strong> {format(ca.startDate, "PPP")}</div>
                                        <div><strong>End:</strong> {format(ca.endDate, "PPP")}</div>
                                        {ca.value && <div><strong>Value:</strong> {ca.value}</div>}
                                        {ca.budgetAvailable && <div><strong>Budget:</strong> {ca.budgetAvailable}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {weeks.length > 0 && (
                <Card className="bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 bg-white shadow-md shadow-sky-500 border border-cyan-700 dark:border-cyan-500">
                    <CardContent className="justify-items-center align-middle mt-5">
                        <Table>
                            <TableCaption>
                                Weekly list from {format(startDate, "PPP")} to {format(endDate, "PPP")}
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Week #</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Active CAs</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Images</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {weeks.map((week) => (
                                    <TableRow key={week.weekNumber}>
                                        <TableCell className="font-medium">Week {week.weekNumber}</TableCell>
                                        <TableCell>{format(week.startDate, "PPP")}</TableCell>
                                        <TableCell>{format(week.endDate, "PPP")}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {week.activeCAs.length > 0 ? (
                                                    week.activeCAs.map(caIndex => {
                                                        const ca = caDateRanges.find(ca => ca.caIndex === caIndex);
                                                        return (
                                                            <Badge 
                                                                key={caIndex} 
                                                                variant="secondary" 
                                                                className="text-xs"
                                                                title={`${ca?.value ? `Value: ${ca.value}` : ''} ${ca?.budgetAvailable ? `Budget: ${ca.budgetAvailable}` : ''}`}
                                                            >
                                                                {ca?.caName || `CA ${caIndex + 1}`}
                                                            </Badge>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                    <div 
                                                        className="bg-green-600 h-2.5 rounded-full" 
                                                        style={{ width: `${week.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm">{week.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {week.images.length > 0 ? (
                                                <div className="flex -space-x-2">
                                                    {week.images.slice(0, 3).map((image, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                                                        >
                                                            <img 
                                                                src={image.preview || "/placeholder.svg"} 
                                                                alt={`Week ${week.weekNumber} image ${idx}`} 
                                                                className="h-full w-full object-cover" 
                                                            />
                                                        </div>
                                                    ))}
                                                    {week.images.length > 3 && (
                                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                                            +{week.images.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No images</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => openProgressDialog(week)}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Update
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Week Progress</DialogTitle>
                        <DialogDescription>
                            {selectedWeek && (
                                <>
                                    Week {selectedWeek.weekNumber}: {format(selectedWeek.startDate, "PPP")} -{" "}
                                    {format(selectedWeek.endDate, "PPP")}
                                    {selectedWeek.activeCAs.length > 0 && (
                                        <div className="mt-2">
                                            <span className="text-sm">Active CAs: </span>
                                            {selectedWeek.activeCAs.map(caIndex => {
                                                const ca = caDateRanges.find(ca => ca.caIndex === caIndex);
                                                return (
                                                    <div key={caIndex} className="inline-block mr-2 mb-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {ca?.caName || `CA ${caIndex + 1}`}
                                                        </Badge>
                                                        {ca?.value && (
                                                            <div className="text-xs text-muted-foreground">Value: {ca.value}</div>
                                                        )}
                                                        {ca?.budgetAvailable && (
                                                            <div className="text-xs text-muted-foreground">Budget: {ca.budgetAvailable}</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Progress (%)</label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[progress]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setProgress(value[0])}
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={progress}
                                    onChange={(e) => setProgress(Number(e.target.value))}
                                    className="w-16"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Images</label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload images for this week</p>
                                <p className="mt-1 text-xs text-gray-400">Maximum 5 files ({5 - images.length} slots available)</p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    * Input will be disabled during image compression
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className={`absolute inset-0 w-full h-full opacity-0 ${
                                        ongoingCompressions > 0 ? "cursor-not-allowed" : "cursor-pointer"
                                    }`}
                                    onChange={handleFileChange}
                                    disabled={images.length >= 5 || ongoingCompressions > 0}
                                />
                            </div>
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                    {images.map((image, imgIndex) => (
                                        <div key={imgIndex} className="relative group">
                                            <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                                                <img
                                                    src={image.preview || "/placeholder.svg"}
                                                    alt={`Preview ${imgIndex}`}
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
                                                onClick={() => removeImage(imgIndex)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {(image.file.size / 1024).toFixed(1)} KB
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveProgress} disabled={ongoingCompressions > 0}>
                            {ongoingCompressions > 0 ? "Compressing..." : "Save Progress"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}