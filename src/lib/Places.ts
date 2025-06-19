import { LatLngExpression } from 'leaflet'

import { Category } from './MarkerCategories'

export interface PlaceValues {
  id: number
  position: LatLngExpression
  category: Category
  title: string
  address: string
}
export type PlacesType = PlaceValues[]
export type PlacesClusterType = Record<string, PlaceValues[]>

export const Places: PlacesType = [
  {
    id: 1,
    position: [3.5673301164211346, 98.66010592167864],
    category: Category.CAT1,
    title: 'Begal Terderteksi',
    address: 'Jl. Dr. Mansyur 1-3, Padang Bulan, Kec. Medan Baru, Kota Medan, Sumatera Utara 20222',
  }
]
