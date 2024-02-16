import { db } from "@/lib/db/index";
import { type WaitlistId, waitlistIdSchema } from "@/lib/db/schema/waitlist";

export const getWaitlists = async () => {
  const w = await db.waitlist.findMany({});
  return { waitlist: w };
};

export const getWaitlistById = async (id: WaitlistId) => {
  const { id: waitlistId } = waitlistIdSchema.parse({ id });
  const w = await db.waitlist.findFirst({
    where: { id: waitlistId}});
  return { waitlist: w };
};


