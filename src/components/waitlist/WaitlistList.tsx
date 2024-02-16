"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Waitlist, CompleteWaitlist } from "@/lib/db/schema/waitlist";
import Modal from "@/components/shared/Modal";

import { Button } from "@/components/ui/button";
import WaitlistForm from "./WaitlistForm";
import { PlusIcon } from "lucide-react";
import { useOptimisticWaitlists } from "@/app/(app)/waitlist/useOptimisticWaitlist";

type TOpenModal = (waitlist?: Waitlist) => void;

export default function WaitlistList({
  waitlist,
}: {
  waitlist: CompleteWaitlist[];
}) {
  const { optimisticWaitlists, addOptimisticWaitlist } =
    useOptimisticWaitlists(waitlist);
  const [open, setOpen] = useState(false);
  const [activeWaitlist, setActiveWaitlist] = useState<Waitlist | null>(null);
  const openModal = (waitlist?: Waitlist) => {
    setOpen(true);
    waitlist ? setActiveWaitlist(waitlist) : setActiveWaitlist(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeWaitlist ? "Edit Waitlist" : "Create Waitlist"}
      >
        <WaitlistForm
          waitlist={activeWaitlist}
          addOptimistic={addOptimisticWaitlist}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticWaitlists.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticWaitlists.map((waitlist) => (
            <Waitlist
              waitlist={waitlist}
              key={waitlist.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Waitlist = ({
  waitlist,
  openModal,
}: {
  waitlist: CompleteWaitlist;
  openModal: TOpenModal;
}) => {
  const optimistic = waitlist.id === "optimistic";
  const deleting = waitlist.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("waitlist")
    ? pathname
    : pathname + "/waitlist/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{waitlist.email}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + waitlist.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No waitlist
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new waitlist.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Waitlist{" "}
        </Button>
      </div>
    </div>
  );
};
