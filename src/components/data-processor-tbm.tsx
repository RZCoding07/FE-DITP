import { useMemo, useCallback } from "react"
import { useWatch } from "react-hook-form"

interface Score {
  [key: string]: {
    regional: string
    kebun: string
    luas: number
    colorCategory: string
  }
}

interface SelectedCard {
  name: string
  val: number
  circular: string
}

export function useDataProcessor(scores: Score[], selectedCard: SelectedCard) {
  const rpc = useWatch({ name: "rpc" })

  const filteredScores = useMemo(() => {
    if (rpc?.value === "all") return scores
    return scores.filter((score) => score[Object.keys(score)[0]].regional === rpc.value)
  }, [scores, rpc?.value])

  const distinctCategories = useMemo(() => {
    return [...new Set(filteredScores.map((item) => item[Object.keys(item)[0]].kebun))]
  }, [filteredScores])

  const processKeseluruhanTBM = useCallback(() => {
    const countBlok = distinctCategories.map((category) => ({
      category,
      filter: filteredScores.filter((item) => item[Object.keys(item)[0]].kebun === category).length,
    }))

    const sumLuasBlok = distinctCategories.map((category) => ({
      category,
      filter: filteredScores
        .filter((item) => item[Object.keys(item)[0]].kebun === category)
        .reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0)
        .toFixed(2),
    }))

    return {
      name: "Keseluruhan TBM",
      value: 4,
      color: "",
      categories: distinctCategories,
      countBlok,
      sumLuasBlok,
      selectedCategory: rpc?.value,
    }
  }, [filteredScores, distinctCategories, rpc?.value])

  const processTBM = useCallback(() => {
    const distinctByTbm = filteredScores.filter((score) => Object.keys(score)[0] === `tbm${selectedCard.val + 1}`)

    const countByColor = (color: string) =>
      distinctByTbm.filter((item) => item[Object.keys(item)[0]].colorCategory === color).length
    const sumLuasByColor = (color: string) =>
      distinctByTbm
        .filter((item) => item[Object.keys(item)[0]].colorCategory === color)
        .reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0)
        .toFixed(2)

    const colorDataDonat = {
      emas: countByColor("gold"),
      hijau: countByColor("green"),
      merah: countByColor("red"),
      hitam: countByColor("black"),
    }

    const colorDataLuasDonat = {
      emas: sumLuasByColor("gold"),
      hijau: sumLuasByColor("green"),
      merah: sumLuasByColor("red"),
      hitam: sumLuasByColor("black"),
    }

    const countBlok = distinctCategories.map((category) => ({
      category,
      filter: distinctByTbm.filter((item) => item[Object.keys(item)[0]].kebun === category).length,
    }))

    const sumLuasBlok = distinctCategories.map((category) => ({
      category,
      filter: distinctByTbm
        .filter((item) => item[Object.keys(item)[0]].kebun === category)
        .reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0)
        .toFixed(2),
    }))

    const name = selectedCard.val === 3 ? "TBM > 3" : `TBM ${selectedCard.val + 1}`

    return {
      name,
      value: selectedCard.val,
      color: selectedCard.circular,
      categories: distinctCategories,
      countBlok,
      sumLuasBlok,
      selectedCategory: rpc?.value,
      colorDataDonat,
      colorDataLuasDonat,
    }
  }, [filteredScores, distinctCategories, selectedCard, rpc?.value])

  const processedData = useMemo(() => {
    if (rpc?.value === "all") {
      return selectedCard.name === "Keseluruhan TBM" ? null : { isKebun: false }
    }

    if (selectedCard.name === "Keseluruhan TBM") {
      return processKeseluruhanTBM()
    }

    if (selectedCard.val < 4) {
      return processTBM()
    }

    return { isTbm: true }
  }, [rpc?.value, selectedCard, processKeseluruhanTBM, processTBM])

  return processedData
}

