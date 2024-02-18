"use client";

import { z } from "zod";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { type Waitlist, insertWaitlistParams } from "@/lib/db/schema/waitlist";
import { createWaitlistAction } from "@/lib/actions/waitlist";

const HomePageWatchListForm = () => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Waitlist>(insertWaitlistParams);

  const router = useRouter();

  const onSuccess = (action: Action, data?: { error: string }) => {
    const failed = Boolean(data?.error);
    if (failed) {
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.push("/waitlist-success");
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const waitlistParsed = await insertWaitlistParams.safeParseAsync({
      ...payload,
    });
    if (!waitlistParsed.success) {
      setErrors(waitlistParsed?.error.flatten().fieldErrors);
      return;
    }

    const values = waitlistParsed.data;
    try {
      const error = await createWaitlistAction(values);
      const errorFormatted = {
        error: error ?? "Error",
      };
      onSuccess("create", error ? errorFormatted : undefined);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form
      action={handleSubmit}
      onChange={handleChange}
      className="flex items-center gap-2 sm:flex-row flex-col w-full sm:w-fit"
    >
      <Input
        className={`w-full flex-1 sm:w-72 placeholder:text-neutral-400 ${cn(
          errors?.email ? "ring ring-destructive" : ""
        )}`}
        type="email"
        required
        placeholder="Enter your email"
        name="email"
      />
      <Button
        className="w-full sm:w-auto"
        type="submit"
        disabled={hasErrors}
        aria-disabled={hasErrors}
      >
        Join waitlist
      </Button>
    </form>
  );
};

export default HomePageWatchListForm;
