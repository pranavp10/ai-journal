import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { accountRouter } from "./account";

export const appRouter = router({
  computers: computersRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
