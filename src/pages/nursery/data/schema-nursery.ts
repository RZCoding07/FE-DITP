import { z } from 'zod';

// Stok Lokasi Bibitan schema for validation and type inference
export const stokLokasiBibitanSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  regional: z.string(),
  kebun: z.string(),
  varietas: z.string(),
  lokasi: z.string(),
  nursery_month_1: z.number().nullable(),
  nursery_month_2: z.number().nullable(),
  nursery_month_3: z.number().nullable(),
  nursery_month_4: z.number().nullable(),
  nursery_month_5: z.number().nullable(),
  nursery_month_6: z.number().nullable(),
  nursery_month_7: z.number().nullable(),
  nursery_month_8: z.number().nullable(),
  nursery_month_9: z.number().nullable(),
  nursery_month_10: z.number().nullable(),
  nursery_month_11: z.number().nullable(),
  nursery_month_12: z.number().nullable(),
  nursery_month_13: z.number().nullable(),
  nursery_month_14: z.number().nullable(),
  nursery_month_15: z.number().nullable(),
  nursery_month_16: z.number().nullable(),
  nursery_month_17: z.number().nullable(),
  nursery_month_18: z.number().nullable(),
  nursery_month_19: z.number().nullable(),
  nursery_month_20: z.number().nullable(),
  nursery_month_21: z.number().nullable(),
  nursery_month_22: z.number().nullable(),
  nursery_month_23: z.number().nullable(),
  nursery_month_24: z.number().nullable(),
  nursery_month_25: z.number().nullable(),
  nursery_month_26: z.number().nullable(),
  nursery_month_27: z.number().nullable(),
  nursery_month_28: z.number().nullable(),
  nursery_month_29: z.number().nullable(),
  nursery_month_30_plus: z.number().nullable(),
  jumlah: z.number().nullable(),
  jumlah_siap_salur: z.number().nullable(),
  bulan: z.number().int(),
  tahun: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type StokLokasiBibitan = z.infer<typeof stokLokasiBibitanSchema>;
