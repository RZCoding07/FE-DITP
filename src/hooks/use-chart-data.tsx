import { useMemo } from "react"
import { countColorBlocks, sumColorLuas } from "@/utils/chartHelper"

export const useChartData = (dataprops: any, categories: string[]) => {
  return useMemo(() => {
    const { dataset, val, color, untuk, title, score } = dataprops
    let datas: any[] = []

    if (untuk === "Total Blok") {
      if (color === "all") {
        datas = categories.map((category) => ({
          category,
          filter: dataset[val].filter((data: any) => data.regional === category).length,
        }))
      } else {
        const dataColor = score.filter((score: any) => (Object.values(score)[0] as any).colorCategory === color)
        datas = categories.map((category) => ({
          category,
          filter: countColorBlocks(dataColor, category, color),
        }))
      }

      if (title === "Keseluruhan TBM") {
        const dataValueOfAllTBM = score.map((item: any) => Object.values(item)[0])
        datas = categories.map((category) => ({
          category,
          filter: dataValueOfAllTBM.filter((data: any) => data.regional === category).length,
        }))
      }
    } else if (untuk === "Total Luasan") {
      if (color === "all") {
        datas = categories.map((category) => {
          const filter = dataset[val].reduce((sum: number, item: any) => {
            return item.regional === category ? sum + Number.parseFloat(item.luas_ha || "0") : sum
          }, 0)
          return { category, filter: Math.round(filter) }
        })
      } else {
        const dataColor = score.filter((score: any) => (Object.values(score)[0] as any).colorCategory === color)
        datas = categories.map((category) => ({
          category,
          filter: sumColorLuas(dataColor, category, color),
        }))
      }

      if (title === "Keseluruhan TBM") {
        const dataValueOfAllTBM = score.map((item: any) => Object.values(item)[0])
        datas = categories.map((category) => {
          const filter = dataValueOfAllTBM.reduce((sum: number, item: any) => {
            return item.regional === category ? sum + Number.parseFloat(item.luas || "0") : sum
          }, 0)
          return { category, filter: Math.round(filter) }
        })
      }
    }

    return datas
  }, [dataprops, categories])
}

