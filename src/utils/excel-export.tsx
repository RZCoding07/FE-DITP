import * as XLSX from "xlsx-js-style"

interface ExcelExportOptions {
  data: any[]
  filename: string
  sheetName?: string
}

export const exportToExcel = ({ data, filename, sheetName = "Sheet1" }: ExcelExportOptions) => {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Define header style
  const headerStyle = {
    fill: {
      fgColor: { rgb: "4F46E5" }, // Blue color
    },
    font: {
      color: { rgb: "FFFFFF" },
      bold: true,
      sz: 12,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  }

  const subHeaderStyle = {
    fill: {
      fgColor: { rgb: "10B981" }, // Green color
    },
    font: {
      color: { rgb: "FFFFFF" },
      bold: true,
      sz: 11,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  }

  const dataStyle = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } },
    },
  }

  // Create worksheet data with headers
  const wsData = []

  // First header row
  const headerRow1 = [
    "No.",
    "Lokasi",
    "",
    "", // Lokasi spans 3 columns
    "Tahun Tanam",
    "Analisis Masalah",
    "",
    "", // Analisis Masalah spans 3 columns
    "Blok",
    "Value PI",
    "Keterangan",
    "Corrective Actions",
    "",
    "",
    "",
    "",
    "", // Corrective Actions spans 6 columns
    "Weekly Progress",
    "Detail Progress",
  ]

  // Second header row
  const headerRow2 = [
    "", // No. (merged from above)
    "Regional",
    "Kebun",
    "Afdeling", // Lokasi sub-headers
    "", // Tahun Tanam (merged from above)
    "Why 1",
    "Why 2",
    "Why 3", // Analisis Masalah sub-headers
    "", // Blok (merged from above)
    "", // Value PI (merged from above)
    "", // Keterangan (merged from above)
    "Action",
    "Value",
    "Start Date",
    "End Date",
    "Budget",
    "Images", // Corrective Actions sub-headers
    "", // Weekly Progress (merged from above)
    "", // Detail Progress (merged from above)
  ]

  wsData.push(headerRow1)
  wsData.push(headerRow2)

  // Add data rows
  data.forEach((item, index) => {
    const row = [
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
      item.action || "",
      item.value || "",
      item.start_date || "",
      item.end_date || "",
      item.budget || "",
      item.images || "",
      item.weekly_progress || "",
      item.detail_progress || "",
    ]
    wsData.push(row)
  })

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column widths
  const colWidths = [
    { wch: 5 }, // No.
    { wch: 12 }, // Regional
    { wch: 15 }, // Kebun
    { wch: 12 }, // Afdeling
    { wch: 12 }, // Tahun Tanam
    { wch: 20 }, // Why 1
    { wch: 20 }, // Why 2
    { wch: 20 }, // Why 3
    { wch: 10 }, // Blok
    { wch: 12 }, // Value PI
    { wch: 15 }, // Keterangan
    { wch: 25 }, // Action
    { wch: 12 }, // Value
    { wch: 12 }, // Start Date
    { wch: 12 }, // End Date
    { wch: 15 }, // Budget
    { wch: 15 }, // Images
    { wch: 20 }, // Weekly Progress
    { wch: 20 }, // Detail Progress
  ]
  ws["!cols"] = colWidths

  // Set row heights
  ws["!rows"] = [
    { hpt: 25 }, // Header row 1
    { hpt: 25 }, // Header row 2
    ...Array(data.length).fill({ hpt: 20 }), // Data rows
  ]

  // Apply styles to cells
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1")

  // Style header rows
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerCell1 = XLSX.utils.encode_cell({ r: 0, c: C })
    const headerCell2 = XLSX.utils.encode_cell({ r: 1, c: C })

    if (ws[headerCell1]) {
      ws[headerCell1].s = headerStyle
    }
    if (ws[headerCell2]) {
      ws[headerCell2].s = subHeaderStyle
    }
  }

  // Style data rows
  for (let R = 2; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
      if (ws[cellAddress]) {
        ws[cellAddress].s = dataStyle
      }
    }
  }

  // Merge cells for headers
  const merges = [
    // First row merges
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // No.
    { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }, // Lokasi
    { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // Tahun Tanam
    { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } }, // Analisis Masalah
    { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } }, // Blok
    { s: { r: 0, c: 9 }, e: { r: 1, c: 9 } }, // Value PI
    { s: { r: 0, c: 10 }, e: { r: 1, c: 10 } }, // Keterangan
    { s: { r: 0, c: 11 }, e: { r: 0, c: 16 } }, // Corrective Actions
    { s: { r: 0, c: 17 }, e: { r: 1, c: 17 } }, // Weekly Progress
    { s: { r: 0, c: 18 }, e: { r: 1, c: 18 } }, // Detail Progress
  ]

  ws["!merges"] = merges

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  // Generate and download file
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
  const finalFilename = `${filename}_${timestamp}.xlsx`

  XLSX.writeFile(wb, finalFilename)
}
