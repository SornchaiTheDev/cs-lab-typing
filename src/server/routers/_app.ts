import { procedure, router } from "../trpc";
import { usersRouter } from "./users";
import { z } from "zod";

export const appRouter = router({
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
