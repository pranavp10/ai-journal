"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/waitlist/useOptimisticWaitlist";
import { type Waitlist } from "@/lib/db/schema/waitlist";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import WaitlistForm from "@/components/waitlist/WaitlistForm";


export default function OptimisticWaitlist({ 
  waitlist,
   
}: { 
  waitlist: Waitlist; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Waitlist) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticWaitlist, setOptimisticWaitlist] = useOptimistic(waitlist);
  const updateWaitlist: TAddOptimistic = (input) =>
    setOptimisticWaitlist({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <WaitlistForm
          waitlist={waitlist}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateWaitlist}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{waitlist.email}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticWaitlist.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticWaitlist, null, 2)}
      </pre>
    </div>
  );
}
