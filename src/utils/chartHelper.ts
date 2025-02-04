export const countColorBlocks = (data: any[], regional: string, color: string) => {
    const tbmKeys = ["tbm1", "tbm2", "tbm3", "tbm4"]
    return data.reduce((count: number, item: any) => {
      return tbmKeys.some((key) => item[key] && item[key].regional === regional && item[key].colorCategory === color)
        ? count + 1
        : count
    }, 0)
  }
  
  export const sumColorLuas = (data: any[], regional: string, color: string) => {
    const tbmKeys = ["tbm1", "tbm2", "tbm3", "tbm4"]
    const total = data.reduce((sum: number, item: any) => {
      return tbmKeys.reduce((innerSum: number, key) => {
        return item[key] && item[key].regional === regional && item[key].colorCategory === color
          ? innerSum + Number.parseFloat(item[key].luas || "0")
          : innerSum
      }, sum)
    }, 0)
  
    return Math.round(total)
  }
  
  export const filterByRegional = (data: any[], regional: string) => {
    return data.filter((item: any) => item.regional === regional)
  }
  
  export const filterByRegionalAndKebun = (data: any[], regional: string, kebun: string) => {
    return data.filter((item: any) => item.regional === regional && item.kebun === kebun)
  }
  
  export const distinctKebunWhereFilterByRegional = (data: any[], regional: string) => {
    const getRegional = filterByRegional(data, regional)
    const kebun = getRegional.reduce((acc: any, item: any) => {
      return item.kebun ? acc.concat(item.kebun) : acc
    }, [])
    return [...new Set(kebun)]
  }
  
  export const sumBlokByDistinctKebun = (data: any[], regional: string, kebun: string) => {
    const getRegional = filterByRegionalAndKebun(data, regional, kebun)
    return getRegional.length
  }
  
  export const sumLuasBlokByDistinctKebun = (data: any[], regional: string, kebun: string, isLuasHa: boolean) => {
    const getRegional = filterByRegionalAndKebun(data, regional, kebun)
    const sum = getRegional.reduce((acc: number, item: any) => {
      return Number.parseFloat(isLuasHa ? item.luas_ha : item.luas || "0") + acc
    }, 0)
    return sum.toFixed(2)
  }
  
  