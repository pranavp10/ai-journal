import { db } from "@/lib/db/index";
import { 
  WaitlistId, 
  NewWaitlistParams,
  UpdateWaitlistParams, 
  updateWaitlistSchema,
  insertWaitlistSchema, 
  waitlistIdSchema 
} from "@/lib/db/schema/waitlist";

export const createWaitlist = async (waitlist: NewWaitlistParams) => {
  const newWaitlist = insertWaitlistSchema.parse(waitlist);
  try {
    const w = await db.waitlist.create({ data: newWaitlist });
    return { waitlist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateWaitlist = async (id: WaitlistId, waitlist: UpdateWaitlistParams) => {
  const { id: waitlistId } = waitlistIdSchema.parse({ id });
  const newWaitlist = updateWaitlistSchema.parse(waitlist);
  try {
    const w = await db.waitlist.update({ where: { id: waitlistId }, data: newWaitlist})
    return { waitlist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteWaitlist = async (id: WaitlistId) => {
  const { id: waitlistId } = waitlistIdSchema.parse({ id });
  try {
    const w = await db.waitlist.delete({ where: { id: waitlistId }})
    return { waitlist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

