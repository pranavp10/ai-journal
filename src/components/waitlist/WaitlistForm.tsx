import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { type Waitlist, insertWaitlistParams } from "@/lib/db/schema/waitlist";
import {
  createWaitlistAction,
  deleteWaitlistAction,
  updateWaitlistAction,
} from "@/lib/actions/waitlist";
import { TAddOptimistic } from "@/app/(app)/waitlist/useOptimisticWaitlist";

const WaitlistForm = ({
  waitlist,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  waitlist?: Waitlist | null;

  openModal?: (waitlist?: Waitlist) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Waitlist>(insertWaitlistParams);
  const editing = !!waitlist?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("waitlist");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Waitlist }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Waitlist ${action}d!`);
      if (action === "delete") router.push(backpath);
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

    closeModal && closeModal();
    const values = waitlistParsed.data;
    const pendingWaitlist: Waitlist = {
      updatedAt: waitlist?.updatedAt ?? new Date(),
      createdAt: waitlist?.createdAt ?? new Date(),
      id: waitlist?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingWaitlist,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateWaitlistAction({ ...values, id: waitlist.id })
          : await createWaitlistAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingWaitlist,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.email ? "text-destructive" : ""
          )}
        >
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? "ring ring-destructive" : "")}
          defaultValue={waitlist?.email ?? ""}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: "delete", data: waitlist });
              const error = await deleteWaitlistAction(waitlist.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: waitlist,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default WaitlistForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
