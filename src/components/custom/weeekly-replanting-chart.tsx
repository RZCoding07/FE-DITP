"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import Papa from "papaparse"
import cookie from "js-cookie"

// Define the data structure type
type WeeklyData = {
  regional: string
  r1: string
  rkap: number | string
  berkontrak: number | string
  landClearing: number | string
  menanam: number | string
}

export default function WeeklyReport() {
  // State to handle client-side rendering
  const [isClient, setIsClient] = useState(false)
  const [dataWeekly, setDataWeekly] = useState<WeeklyData[]>([])
  const [periode, setPeriode] = useState("W4 Maret 2025")
  const [keyHighlights, setKeyHighlights] = useState<string[]>([])
  const [groupedData, setGroupedData] = useState<{ [key: string]: WeeklyData[] }>({})
  const [isLoading, setIsLoading] = useState(true)

  const theme = cookie.get("theme") || "light"

  // Process CSV data into the required format
  const processCSVData = (data: any[][]) => {
    try {
      // Extract period information (if available)
      const periodRow = data.find((row) => row[1]?.includes("Minggu Ini Periode:"))
      if (periodRow && periodRow[2]) {
        setPeriode(periodRow[2].trim() || "W1 Maret 2025")
      }

      // Extract key highlights
      const highlightIndex = data.findIndex((row) => row.includes("Key Highlight"))
      if (highlightIndex > 0 && data[highlightIndex + 2]) {
        const highlights = []
        let i = highlightIndex + 2
        while (i < data.length && data[i][37]) {
          if (data[i][37].trim()) {
            highlights.push(data[i][37].trim())
          }
          i++
        }
        if (highlights.length > 0) {
          setKeyHighlights(highlights)
        }
      }

      // Process main data rows
      const processedData: WeeklyData[] = []

      // Find the start of the data rows (usually after headers)
      const dataStartIndex = data.findIndex((row) => row[1]?.trim() === "Palm Co" && row[2]?.trim() === "R1")

      if (dataStartIndex > 0) {
        // Process Palm Co rows
        let currentRegional = "Palm Co"
        let i = dataStartIndex

        while (i < data.length && data[i][1]?.trim() !== "KSO") {
          const row = data[i]

          // Check if this is a sub-total row
          if (row[1]?.includes("Sub Total")) {
            processedData.push({
              regional: row[1].trim(),
              r1: "",
              rkap: cleanNumber(row[3]),
              berkontrak: cleanNumber(row[6]),
              landClearing: cleanNumber(row[10]),
              menanam: cleanNumber(row[12]),
            })
            i++
            continue
          }

          // Regular data row
          if (row[2] && row[3]) {
            processedData.push({
              regional: currentRegional,
              r1: row[2].trim(),
              rkap: cleanNumber(row[3]),
              berkontrak: cleanNumber(row[6]),
              landClearing: cleanNumber(row[10]),
              menanam: cleanNumber(row[12]),
            })
          }

          i++
        }

        // Process KSO rows
        if (i < data.length && data[i][1]?.trim() === "KSO") {
          currentRegional = "KSO"

          while (i < data.length && !data[i][1]?.includes("TOTAL")) {
            const row = data[i]

            // Check if this is a sub-total row
            if (row[1]?.includes("Sub Total")) {
              processedData.push({
                regional: row[1].trim(),
                r1: "",
                rkap: cleanNumber(row[3]),
                berkontrak: cleanNumber(row[6]),
                landClearing: cleanNumber(row[10]),
                menanam: cleanNumber(row[12]),
              })
              i++
              continue
            }

            // Regular data row
            if (row[2] && row[3]) {
              processedData.push({
                regional: currentRegional,
                r1: row[2].trim(),
                rkap: cleanNumber(row[3]),
                berkontrak: cleanNumber(row[6]),
                landClearing: cleanNumber(row[10]),
                menanam: cleanNumber(row[12]),
              })
            }

            i++
          }
        }

        // Process TOTAL row
        if (i < data.length && data[i][1]?.includes("TOTAL")) {
          processedData.push({
            regional: "TOTAL",
            r1: "",
            rkap: cleanNumber(data[i][3]),
            berkontrak: cleanNumber(data[i][6]),
            landClearing: cleanNumber(data[i][10]),
            menanam: cleanNumber(data[i][12]),
          })
        }
      }

      if (processedData.length > 0) {
        setDataWeekly(processedData)

        // Group data by regional
        const grouped = processedData.reduce((acc: { [key: string]: WeeklyData[] }, item) => {
          const mainRegional =
            item.regional.includes("Sub Total") || item.regional === "TOTAL" ? item.regional : item.regional

          if (!acc[mainRegional]) {
            acc[mainRegional] = []
          }

          acc[mainRegional].push(item)
          return acc
        }, {})

        setGroupedData(grouped)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error processing CSV data:", error)
      setIsLoading(false)
    }
  }

  // Helper function to clean number values from CSV
  const cleanNumber = (value: string): number | string => {
    if (!value || value.trim() === "" || value.trim() === "-") return "-"

    // Remove commas, spaces, and other non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.-]/g, "")
    const num = Number.parseFloat(cleaned)

    return isNaN(num) ? "-" : num
  }

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXTlsseLkShodSUOy-i7l7t03FF68IcucYTYEJmny_lhaODbCQqZZDTEd5dDZfhImykjCwetxwIlXS/pub?gid=1283589509&single=true&output=csv",
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,
          skipEmptyLines: true,
          complete: (result: any) => {
            console.log("working", result.data)
            processCSVData(result.data)
          },
        })
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Helper function to determine the color of the progress bar based on percentage
  const getBarColor = (value: number) => {
    if (value > 93) return "#34a853" // Hijau
    if (value > 70) return "#46bdc6" // Biru
    if (value > 50) return "#46bdc6" // Kuning
    return "#46bdc6" // Merah
  }

  const calculatePercentage = (value: any, total: number) => {
    if (value === "-" || value === 0) return 0
    return Number.parseFloat(((value / total) * 100).toFixed(2))
  }

  // Function to format the percentage display
  const formatPercentage = (percentage: number) => {
    if (percentage === 0) return "0%"
    return `${percentage}%`
  }

  const formatNumber = (value: any) => {
    if (!value || value === "-") return "-"

    // Konversi nilai ke number jika belum
    const numericValue = typeof value === "number" ? value : Number.parseFloat(value)

    // Cek jika nilai bukan angka
    if (isNaN(numericValue)) return "-"

    // Pisahkan bagian integer dan desimal
    const [integerPart, decimalPart] = String(numericValue).split(".")

    // Format bagian integer dengan separator ribuan
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // Gabungkan kembali dengan bagian desimal jika ada
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading data...</h2>
          <div className="w-16 h-16 border-4 border-t-[#00695c] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-4">
      <div className="flex flex-col lg:flex-row align-middle gap-5 justify-between items-start mb-6">
        <div className="w-full lg:w-2/3">
          <h1 className="text-4xl font-bold text-[#00695c] dark:text-[#35a39a]">Weekly Report</h1>
          <h2 className="text-xl text-[#689b2d] dark:text-white font-semibold">Periode: {periode}</h2>
          <br />
          <div className="overflow-x-auto">
            <table className="w-full border border-cyan-900 bg-white dark:bg-[#0a192f] dark:text-white">
              <thead className="bg-[#1ea297] text-white">
                <tr>
                  <th colSpan={2} className="px-4 py-2 border border-cyan-900">
                    Regional
                  </th>
                  <th className="px-4 py-2 border border-cyan-900">RKAP (Ha)</th>
                  <th className="px-4 py-2 border border-cyan-900">Berkontrak (Ha)</th>
                  <th className="px-4 py-2 border border-cyan-900">%</th>
                  <th className="px-4 py-2 border border-cyan-900">Land Clearing s.d Bi (Ha)</th>
                  <th className="px-4 py-2 border border-cyan-900">%</th>
                  <th className="px-4 py-2 border border-cyan-900">Menanam S.d Bi (Ha)</th>
                  <th className="px-4 py-2 border border-cyan-900">%</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([regional, items]) => {
                  // Skip the "Sub Total" and "TOTAL" entries as they'll be handled separately
                  if (regional.includes("Sub Total") || regional === "TOTAL") {
                    return null
                  }

                  return (
                    <>
                      {items.map((item: any, itemIndex: any) => (
                        <tr key={`${regional}-${itemIndex}`}>
                          {itemIndex === 0 && (
                            <td rowSpan={items.length} className="px-4 py-2 border border-cyan-900">
                              {regional}
                            </td>
                          )}
                          <td className="px-4 py-2 border border-cyan-900">{item.r1}</td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
                          <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                            {formatPercentage(calculatePercentage(Number(item.berkontrak) || 0, Number(item.rkap) || 0))}
                            <Progress
                              value={calculatePercentage(item.berkontrak, item.rkap)}
                              className="h-2 mt-1"
                              bgColor={getBarColor(calculatePercentage(item.berkontrak, item.rkap))}
                            />
                          </td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
                          <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                            {formatPercentage(calculatePercentage(item.landClearing, item.rkap))}
                            <Progress
                              value={calculatePercentage(item.landClearing, item.rkap)}
                              className="h-2 mt-1"
                              bgColor={getBarColor(calculatePercentage(item.landClearing, item.rkap))}
                            />
                          </td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
                          <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                            {formatPercentage(calculatePercentage(item.menanam, item.rkap))}
                            <Progress
                              value={calculatePercentage(item.menanam, item.rkap)}
                              className="h-2 mt-1"
                              bgColor={getBarColor(calculatePercentage(item.menanam, item.rkap))}
                            />
                          </td>
                        </tr>
                      ))}

                      {/* Render the Sub Total row for this regional */}
                      {groupedData[`Sub Total ${regional}`]?.map((item:any, index) => (
                        <tr key={`sub-total-${regional}-${index}`} className="bg-gray-100 dark:bg-[#0f2a43]">
                          <td colSpan={2} className="px-4 py-2 border border-cyan-900 font-medium">
                            {item.regional}
                          </td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
                          <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                            {formatPercentage(calculatePercentage(Number(item.berkontrak) || 0, Number(item.rkap) || 0))}
                            <Progress
                              value={calculatePercentage(item.berkontrak, item.rkap)}
                              className="h-2 mt-1"
                              bgColor={getBarColor(calculatePercentage(item.berkontrak, item.rkap))}
                            />
                          </td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
                          <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                            {formatPercentage(calculatePercentage(item.landClearing, item.rkap))}
                            <Progress
                              value={calculatePercentage(item.landClearing, item.rkap)}
                              className="h-2 mt-1"
                              bgColor={getBarColor(calculatePercentage(item.landClearing, item.rkap))}
                            />
                          </td>
                          <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
                          <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                            {formatPercentage(calculatePercentage(item.menanam, item.rkap))}
                            <Progress
                              value={calculatePercentage(item.menanam, item.rkap)}
                              className="h-2 mt-1"
                              bgColor={getBarColor(calculatePercentage(item.menanam, item.rkap))}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  )
                })}

                {/* Render the TOTAL row */}
                {groupedData["TOTAL"]?.map((item: any, index: any) => (
                  <tr key={`total-${index}`} className="font-bold bg-[#e6f7f5] dark:bg-[#0a3d4d]">
                    <td colSpan={2} className="px-4 py-2 border border-cyan-900">
                      {item.regional}
                    </td>
                    <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
                    <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
                    <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                      {formatPercentage(calculatePercentage(item.berkontrak, item.rkap))}
                      <Progress
                        value={calculatePercentage(item.berkontrak, item.rkap)}
                        className="h-2 mt-1"
                        bgColor={getBarColor(calculatePercentage(item.berkontrak, item.rkap))}
                      />
                    </td>
                    <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
                    <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                      {formatPercentage(calculatePercentage(item.landClearing, item.rkap))}
                      <Progress
                        value={calculatePercentage(item.landClearing, item.rkap)}
                        className="h-2 mt-1"
                        bgColor={getBarColor(calculatePercentage(item.landClearing, item.rkap))}
                      />
                    </td>
                    <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
                    <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                      {formatPercentage(calculatePercentage(item.menanam, item.rkap))}
                      <Progress
                        value={calculatePercentage(item.menanam, item.rkap)}
                        className="h-2 mt-1"
                        bgColor={getBarColor(calculatePercentage(item.menanam, item.rkap))}
                      />

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 w-full lg:w-1/3">
          <h3 className="text-xl font-semibold text-[#00695c] dark:text-[#4ee4d7] border-b-2 border-[#00695c] dark:border-[#00695c] mb-4">
            Key Highlight
          </h3>
          <ul className="space-y-4">
            {keyHighlights.map((highlight, index) => (
              <li key={index} className="flex gap-2">
                <div className="min-w-4 h-4 border-2 border-[#00695c] dark:border-[#00695c] mt-1"></div>
                <div dangerouslySetInnerHTML={{ __html: highlight.replace(/\n/g, "<br/>") }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
