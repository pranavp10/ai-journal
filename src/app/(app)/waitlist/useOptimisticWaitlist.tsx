
import { type Waitlist, type CompleteWaitlist } from "@/lib/db/schema/waitlist";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Waitlist>) => void;

export const useOptimisticWaitlists = (
  waitlist: CompleteWaitlist[],
  
) => {
  const [optimisticWaitlists, addOptimisticWaitlist] = useOptimistic(
    waitlist,
    (
      currentState: CompleteWaitlist[],
      action: OptimisticAction<Waitlist>,
    ): CompleteWaitlist[] => {
      const { data } = action;

      

      const optimisticWaitlist = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticWaitlist]
            : [...currentState, optimisticWaitlist];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticWaitlist } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticWaitlist, optimisticWaitlists };
};
