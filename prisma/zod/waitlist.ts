import * as z from "zod"

export const waitlistSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email'),
  createdAt: z.date(),
  updatedAt: z.date(),
})
