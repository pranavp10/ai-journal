import { waitlistSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getWaitlists } from "@/lib/api/waitlist/queries";


// Schema for waitlist - used to validate API requests
const baseSchema = waitlistSchema.omit(timestamps)

export const insertWaitlistSchema = baseSchema.omit({ id: true });
export const insertWaitlistParams = baseSchema.extend({}).omit({
  id: true
});

export const updateWaitlistSchema = baseSchema;
export const updateWaitlistParams = updateWaitlistSchema.extend({})
export const waitlistIdSchema = baseSchema.pick({ id: true });

// Types for waitlist - used to type API request params and within Components
export type Waitlist = z.infer<typeof waitlistSchema>;
export type NewWaitlist = z.infer<typeof insertWaitlistSchema>;
export type NewWaitlistParams = z.infer<typeof insertWaitlistParams>;
export type UpdateWaitlistParams = z.infer<typeof updateWaitlistParams>;
export type WaitlistId = z.infer<typeof waitlistIdSchema>["id"];

// this type infers the return from getWaitlist() - meaning it will include any joins
export type CompleteWaitlist = Awaited<ReturnType<typeof getWaitlists>>["waitlist"][number];

