import { useMemo } from "react"
import { countColorBlocks, sumColorLuas } from "@/utils/chart-helper"

interface ChartDataProps {
  dataset: any[]
  val?: number
  color?: string
  untuk: "Total Blok" | "Total Luasan"
  title: string
  score: any[]
  ctg?: string
  rpc?: any
}

export const useChartData = (dataprops: ChartDataProps, categories: string[]) => {
  return useMemo(() => {
    const { dataset, val, color, untuk, title, score } = dataprops
    let datas: { category: string; filter: number }[] = []

    if (!categories || !Array.isArray(categories)) {
      return []
    }

    try {
      if (untuk === "Total Blok") {
        if (color === "all") {
          // Safely handle dataset[val] being undefined
          const currentDataset = val !== undefined && Array.isArray(dataset[val]) ? dataset[val] : []
          datas = categories.map((category) => ({
            category,
            filter: currentDataset.filter((data: any) => data?.regional === category).length,
          }))
        } else {
          const dataColor = score.filter((scoreItem: any) => {
            const scoreValue = Object.values(scoreItem)[0] as any
            return scoreValue?.colorCategory === color
          })
          
          datas = categories.map((category) => ({
            category,
            filter: countColorBlocks(dataColor, category, color || ""),
          }))
        }

        if (title === "Keseluruhan TBM") {
          const dataValueOfAllTBM = score.map((item: any) => Object.values(item)[0]).filter(Boolean)
          datas = categories.map((category) => ({
            category,
            filter: dataValueOfAllTBM.filter((data: any) => data?.regional === category).length,
          }))
        }
      } else if (untuk === "Total Luasan") {
        if (color === "all") {
          // Safely handle dataset[val] being undefined
          const currentDataset = val !== undefined && Array.isArray(dataset[val]) ? dataset[val] : []
          datas = categories.map((category) => {
            const filter = currentDataset.reduce((sum: number, item: any) => {
              return item?.regional === category ? sum + Number.parseFloat(item?.luas_ha || "0") : sum
            }, 0)
            return { category, filter: Math.round(filter) }
          })
        } else {
          const dataColor = score.filter((scoreItem: any) => {
            const scoreValue = Object.values(scoreItem)[0] as any
            return scoreValue?.colorCategory === color
          })
          
          datas = categories.map((category) => ({
            category,
            filter: sumColorLuas(dataColor, category, color || ""),
          }))
        }

        if (title === "Keseluruhan TBM") {
          const dataValueOfAllTBM = score.map((item: any) => Object.values(item)[0]).filter(Boolean)
          datas = categories.map((category) => {
            const filter = dataValueOfAllTBM.reduce((sum: number, item: any) => {
              return item?.regional === category ? sum + Number.parseFloat(item?.luas || "0") : sum
            }, 0)
            return { category, filter: Math.round(filter) }
          })
        }
      }

      return datas
    } catch (error) {
      console.error("Error in useChartData:", error)
      return categories.map(category => ({ category, filter: 0 }))
    }
  }, [dataprops, categories])
}