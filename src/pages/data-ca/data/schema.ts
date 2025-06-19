import { z } from 'zod'

// User schema for validation and type inference
export const userSchema = z.object({
  id: z.string(),
  fullname: z.string(),
  nip: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  refreshToken: z.string().nullable(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type User = z.infer<typeof userSchema>
