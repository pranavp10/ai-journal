import { Suspense } from "react";

import Loading from "@/app/loading";
import WaitlistList from "@/components/waitlist/WaitlistList";
import { getWaitlists } from "@/lib/api/waitlist/queries";

export const revalidate = 0;

export default async function WaitlistPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Waitlist</h1>
        </div>
        <Waitlist />
      </div>
    </main>
  );
}

const Waitlist = async () => {
  const { waitlist } = await getWaitlists();

  return (
    <Suspense fallback={<Loading />}>
      <WaitlistList waitlist={waitlist} />
    </Suspense>
  );
};
