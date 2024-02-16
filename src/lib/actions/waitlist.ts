"use server";

import { revalidatePath } from "next/cache";
import {
  createWaitlist,
  deleteWaitlist,
  updateWaitlist,
} from "@/lib/api/waitlist/mutations";
import {
  WaitlistId,
  NewWaitlistParams,
  UpdateWaitlistParams,
  waitlistIdSchema,
  insertWaitlistParams,
  updateWaitlistParams,
} from "@/lib/db/schema/waitlist";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateWaitlists = () => revalidatePath("/waitlist");

export const createWaitlistAction = async (input: NewWaitlistParams) => {
  try {
    const payload = insertWaitlistParams.parse(input);
    await createWaitlist(payload);
    revalidateWaitlists();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateWaitlistAction = async (input: UpdateWaitlistParams) => {
  try {
    const payload = updateWaitlistParams.parse(input);
    await updateWaitlist(payload.id, payload);
    revalidateWaitlists();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteWaitlistAction = async (input: WaitlistId) => {
  try {
    const payload = waitlistIdSchema.parse({ id: input });
    await deleteWaitlist(payload.id);
    revalidateWaitlists();
  } catch (e) {
    return handleErrors(e);
  }
};