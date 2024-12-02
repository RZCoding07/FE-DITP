import { z } from 'zod'

// Adjusted schema based on the `master_norma` table fields
export const normaSchema = z.object({
  id: z.string(),
  bidang_tanaman: z.string(),
  jenis_pekerjaan: z.string(),
  satuan: z.string(),
  norma_tp: z.number().nullable(),
  norma_ts: z.number().nullable(),
  pedoman: z.string().nullable(),
  createdAt: z.string(),  // ISO 8601 date string
  updatedAt: z.string(),  // ISO 8601 date string
})

export type Norma = z.infer<typeof normaSchema>
