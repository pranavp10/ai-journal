import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getWaitlistById } from "@/lib/api/waitlist/queries";
import OptimisticWaitlist from "./OptimisticWaitlist";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function WaitlistPage({
  params,
}: {
  params: { waitlistId: string };
}) {

  return (
    <main className="overflow-auto">
      <Waitlist id={params.waitlistId} />
    </main>
  );
}

const Waitlist = async ({ id }: { id: string }) => {
  
  const { waitlist } = await getWaitlistById(id);
  

  if (!waitlist) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="waitlist" />
        <OptimisticWaitlist waitlist={waitlist}  />
      </div>
    </Suspense>
  );
};
