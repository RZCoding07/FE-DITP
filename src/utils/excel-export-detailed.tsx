import * as XLSX from "xlsx-js-style"

interface DetailedExcelExportOptions {
    data: any[]
    filename: string
    sheetName?: string
}

export const exportDetailedToExcel = ({ data, filename, sheetName = "Sheet1" }: DetailedExcelExportOptions) => {
    if (!data || data.length === 0) {
        console.warn("No data to export")
        return
    }

    console.log("Exporting detailed data to Excel:", data)

    // Create a new workbook
    const wb = XLSX.utils.book_new()

    // Define styles
    const headerStyle = {
        fill: { fgColor: { rgb: "4F46E5" } },
        font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
        },
    }

    const dataStyle = {
        alignment: { horizontal: "left", vertical: "top", wrapText: true },
        border: {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } },
        },
    }

    // Create detailed worksheet data
    const wsData = []

    // Headers
    const headers = [
        "No.",
        "Regional",
        "Kebun",
        "Afdeling",
        "Tahun Tanam",
        "Why 1",
        "Why 2",
        "Why 3",
        "Blok",
        "Value PI",
        "Keterangan",
        "Corrective Actions",
        "Action Values",
        "Start Dates",
        "End Dates",
        "Total Budget",
        "Images",
        "Weekly Progress",
        "Detail Progress",
        "Progress Percentage",
        "Status",
        "PIC",
        "Last Updated",
    ]

    wsData.push(headers)

    // Helper functions
    const formatCurrency = (value: any) => {
        if (!value) return ""
        const num = Number(value)
        if (isNaN(num)) return value
        return `Rp ${num.toLocaleString("id-ID")}`
    }

    const formatDate = (dateString: any) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("id-ID")
        } catch {
            return dateString
        }
    }

    const formatDateTime = (dateString: any) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleString("id-ID")
        } catch {
            return dateString
        }
    }

    // Function to parse corrective_actions (handles both string and array)
    const parseCorrectiveActions = (caString: string) => {
        try {
            if (Array.isArray(caString)) return caString
            return JSON.parse(caString)
        } catch {
            return []
        }
    }

    // Process data - combine multiple corrective actions into one row
    data.forEach((item, index) => {
        const baseData = [
            index + 1,
            item.regional || "",
            item.kebun || "",
            item.afdeling || "",
            item.tahun_tanam || "",
            item.why1 || "",
            item.why2 || "",
            item.why3 || "",
            item.blok || "",
            item.value_pi || "",
            item.keterangan || "",
        ]

        // Handle corrective actions
        const correctiveActions = parseCorrectiveActions(item.corrective_actions || [])
        
        // Combine all corrective actions into single fields
        let combinedActions: string[] = []
        let combinedValues: string[] = []
        let combinedStartDates: string[] = []
        let combinedEndDates: string[] = []
        let totalBudget = 0
        let allImageLinks: string[] = []
        let latestStatus = item.status || ""
        let latestPIC = item.pic || ""
        let latestUpdate = item.updatedAt || item.updated_at || ""

        correctiveActions.forEach((ca: any) => {
            // Collect actions
            const action = ca.ca || ca.action || ca.description || ""
            if (action) combinedActions.push(action)
            
            // Collect values
            const value = ca.value || ca.target_value || ""
            if (value) combinedValues.push(value)
            
            // Collect dates
            const startDate = formatDate(ca.startDate || ca.start_date)
            if (startDate) combinedStartDates.push(startDate)
            
            const endDate = formatDate(ca.endDate || ca.end_date)
            if (endDate) combinedEndDates.push(endDate)
            
            // Calculate total budget
            const budget = Number(ca.budget) || 0
            totalBudget += budget
            
            // Collect images
            if (ca.images && Array.isArray(ca.images)) {
                ca.images.forEach((img: any) => {
                    if (img.name) allImageLinks.push(img.name)
                })
            }
            
            // Get latest status, PIC, and update time
            if (ca.status) latestStatus = ca.status
            if (ca.pic) latestPIC = ca.pic
            if (ca.updated_at) latestUpdate = ca.updated_at
        })

        // If no corrective actions, use item's data
        if (correctiveActions.length === 0) {
            const action = item.corrective_action || item.action || ""
            if (action) combinedActions.push(action)
            
            const value = item.corrective_value || item.ca_value || ""
            if (value) combinedValues.push(value)
            
            const startDate = formatDate(item.start_date)
            if (startDate) combinedStartDates.push(startDate)
            
            const endDate = formatDate(item.end_date)
            if (endDate) combinedEndDates.push(endDate)
            
            totalBudget = Number(item.budget) || 0
        }

        const row = [
            ...baseData,
            combinedActions.join(", "), // Pisahkan dengan koma
            combinedValues.join(", "), // Pisahkan dengan koma
            combinedStartDates.join(", "), // Pisahkan dengan koma
            combinedEndDates.join(", "), // Pisahkan dengan koma
            formatCurrency(totalBudget),
            allImageLinks.join(", "),
            item.weekly_progress || "",
            item.detail_progress || "",
            item.max_progress_percentage || "",
            latestStatus,
            latestPIC,
            formatDateTime(latestUpdate),
        ]

        wsData.push(row)
    })

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    const colWidths = [
        { wch: 8 }, // No.
        { wch: 12 }, // Regional
        { wch: 15 }, // Kebun
        { wch: 12 }, // Afdeling
        { wch: 12 }, // Tahun Tanam
        { wch: 25 }, // Why 1
        { wch: 25 }, // Why 2
        { wch: 25 }, // Why 3
        { wch: 10 }, // Blok
        { wch: 12 }, // Value PI
        { wch: 20 }, // Keterangan
        { wch: 35 }, // Corrective Actions
        { wch: 20 }, // Action Values (diperlebar)
        { wch: 20 }, // Start Dates (diperlebar)
        { wch: 20 }, // End Dates (diperlebar)
        { wch: 18 }, // Total Budget
        { wch: 25 }, // Images
        { wch: 25 }, // Weekly Progress
        { wch: 25 }, // Detail Progress
        { wch: 12 }, // Progress %
        { wch: 12 }, // Status
        { wch: 15 }, // PIC
        { wch: 18 }, // Last Updated
    ]
    ws["!cols"] = colWidths

    // Apply styles
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1")

    // Style header row
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: C })
        if (ws[headerCell]) {
            ws[headerCell].s = headerStyle
        }
    }

    // Style data rows
    for (let R = 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
            if (ws[cellAddress]) {
                ws[cellAddress].s = dataStyle
            }
        }
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Generate and download file
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const finalFilename = `${filename}_detailed_${timestamp}.xlsx`

    XLSX.writeFile(wb, finalFilename)
}